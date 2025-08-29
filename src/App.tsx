import { useState } from 'react';
import './App.css'
import Header from './Components/Header/Header'
import TriviaContainer from './Components/TriviaContainer/TriviaContainer'
import { getQuizQuestions } from './services/gemini.ts'
import type { QuestionType } from './services/types.ts';

function App() {
  const [showTrivia, setShowTrivia] = useState(false)
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [loading, setLoading] = useState(false);

  const startNewQuiz = async () => {
    try {
      const newQuestions = await getQuizQuestions(10);
      setQuestions(newQuestions);
      setLoading(false)
    } catch (error) {
      console.error('Quiz loading failed:', error);
      setLoading(false);
    }
  };

  const handleClick = () => {
    setShowTrivia(true)
    setLoading(true);
    startNewQuiz()
  }

  return (
    <div className="app">
      <Header />
      {!showTrivia && <button className="app-btn" onClick={handleClick}>Begin!</button>}
      {showTrivia && <TriviaContainer loading={loading} questions={questions} startNewGame={handleClick}/>}
    </div>
  )
}

export default App
