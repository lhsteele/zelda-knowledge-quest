import { hardcodedQuestions } from '../data/questions.js';
import { type QuestionType } from './types.js';

const DEBOUNCE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
const LAST_API_CALL_KEY = 'last-api-call-timestamp';

export async function getQuizQuestions(count: number = 10): Promise<QuestionType[]> {
  const shouldCallAPI = canCallAPI();
  
  if (shouldCallAPI) {
    console.log('🤖 Generating fresh questions from Gemini...');
    try {
      const apiQuestions = await generateQuestionsFromGemini(count);
      updateLastAPICallTime();
      return apiQuestions;
    } catch (error) {
      console.error('Gemini API call failed, falling back to hardcoded questions:', error);
      return getHardcodedQuestions(count);
    }
  } else {
    const timeLeft = getTimeUntilNextAPICall();
    console.log(`⏱️ Using hardcoded questions (API available in ${Math.ceil(timeLeft / 60000)} minutes)`);
    return getHardcodedQuestions(count);
  }
}

// Check if we can make an API call based on debounce timer
function canCallAPI(): boolean {
  const lastCallTime = localStorage.getItem(LAST_API_CALL_KEY);
  if (!lastCallTime) return true; // First time ever
  
  const timeSinceLastCall = Date.now() - parseInt(lastCallTime);
  return timeSinceLastCall >= DEBOUNCE_DURATION;
}

// Get time remaining until next API call is allowed
function getTimeUntilNextAPICall(): number {
  const lastCallTime = localStorage.getItem(LAST_API_CALL_KEY);
  if (!lastCallTime) return 0;
  
  const timeSinceLastCall = Date.now() - parseInt(lastCallTime);
  return Math.max(0, DEBOUNCE_DURATION - timeSinceLastCall);
}

// Update the timestamp of last API call
function updateLastAPICallTime(): void {
  localStorage.setItem(LAST_API_CALL_KEY, Date.now().toString());
}

// Generate questions from Google Gemini API
async function generateQuestionsFromGemini(count: number): Promise<QuestionType[]> {
  const prompt = `You are a Legend of Zelda expert who has extensively studied Hyrule Historia, Encyclopedia, Art & Artifacts, and Breath of the Wild guides. Generate exactly ${count} challenging multiple choice trivia questions.

Focus on deep lore from the official books:
- Timeline complexities and alternate outcomes from Hyrule Historia
- Character backstories and relationships from Encyclopedia
- Detailed item/weapon lore and origins
- Location histories and hidden details from all sources
- Game mechanics and their lore explanations
- Art design choices and their meanings from Art & Artifacts

Make questions challenging for someone who has read the official books cover-to-cover. Mix difficulty levels from medium to very hard.

Format as a JSON array with this exact structure:
[
  {
    "question": "According to Hyrule Historia, what caused the timeline split after Ocarina of Time?",
    "options": ["Link's time travel", "Ganon's defeat methods", "Link's failure or success", "Zelda's magic"],
    "correct": 2,
    "difficulty": "medium",
    "category": "timeline",
    "source": "Hyrule Historia"
  }
]

Categories to use: timeline, characters, items, locations, mechanics, art, story
Difficulties to use: easy, medium, hard
Sources to use: "Hyrule Historia", "Encyclopedia", "Art & Artifacts", "Breath of the Wild Guide"

Return ONLY the JSON array, no explanations or markdown formatting.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Gemini API error response:', errorBody);
    throw new Error(`Gemini API error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  
  // Gemini response structure: data.candidates[0].content.parts[0].text
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  
  if (!content) {
    throw new Error('No content in Gemini response');
  }
  
  // Remove any markdown code blocks if present
  const cleanContent = content.replace(/```json\n?|\n?```/g, '');
  
  try {
    const questions: QuestionType[] = JSON.parse(cleanContent);
    
    // Validate question format
    const validQuestions = questions.filter(q => 
      q.question && 
      Array.isArray(q.options) && 
      q.options.length === 4 && 
      typeof q.correct === 'number' && 
      q.correct >= 0 && 
      q.correct < 4
    );

    if (validQuestions.length === 0) {
      throw new Error('No valid questions in Gemini response');
    }

    console.log(`✅ Generated ${validQuestions.length} valid questions from Gemini`);

    // Add metadata
    return validQuestions.map(q => ({
      ...q,
      id: generateQuestionId(),
      source: q.source || 'Gemini Generated',
      timestamp: Date.now()
    }));

  } catch (parseError) {
    console.error('Failed to parse Gemini response:', parseError);
    console.error('Raw response content:', content);
    throw new Error('Invalid JSON response from Gemini API');
  }
}

// Get random questions from hardcoded bank
function getHardcodedQuestions(count: number): QuestionType[] {
  const availableQuestions = [...hardcodedQuestions];
  
  // Shuffle array
  for (let i = availableQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableQuestions[i], availableQuestions[j]] = [availableQuestions[j], availableQuestions[i]];
  }
  
  // Return requested count
  const selectedQuestions = availableQuestions.slice(0, count);
  
  // Add metadata
  return selectedQuestions.map(q => ({
    ...q,
    id: q.id || generateQuestionId(),
    source: q.source || 'Hardcoded',
    timestamp: Date.now()
  }));
}

// Generate unique question ID
function generateQuestionId(): string {
  return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Utility functions for debugging/admin
export function getDebugInfo() {
  const lastCall = localStorage.getItem(LAST_API_CALL_KEY);
  const timeUntilNext = getTimeUntilNextAPICall();
  
  return {
    canCallAPI: canCallAPI(),
    lastAPICall: lastCall ? new Date(parseInt(lastCall)).toLocaleString() : 'Never',
    timeUntilNextCall: Math.ceil(timeUntilNext / 60000), // in minutes
    hardcodedQuestionCount: hardcodedQuestions.length,
    apiProvider: 'Google Gemini'
  };
}

export function resetAPITimer(): void {
  localStorage.removeItem(LAST_API_CALL_KEY);
  console.log('API timer reset - next quiz will use Gemini API');
}

export function forceHardcodedQuestions(): void {
  // Set timestamp to future to force hardcoded questions
  localStorage.setItem(LAST_API_CALL_KEY, (Date.now() + DEBOUNCE_DURATION).toString());
  console.log('Forced hardcoded mode for 10 minutes');
}