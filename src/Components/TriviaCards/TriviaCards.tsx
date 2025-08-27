import { useState, type FunctionComponent } from 'react';
import './TriviaCards.css'
import type { QuestionType } from '../../services/types';

export type TriviaCardsProps = {
    setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>,
    setTotalCorrect: React.Dispatch<React.SetStateAction<number>>,
    correctAnswers: number[];
    setCorrectAnswers: React.Dispatch<React.SetStateAction<number[]>>,
    question: QuestionType
}

const TriviaCards:FunctionComponent<TriviaCardsProps> = ({ setCurrentQuestion, question, setTotalCorrect, correctAnswers, setCorrectAnswers }) => {
    const [checking, setChecking] = useState(false)
    const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>()


    const handleSubmitClick = () => {
        setChecking(true)
        setTimeout(() => {
            const currentCorrect = correctAnswers
            if (selectedOptionIdx === question.correct) {
                setTotalCorrect(prev => prev + 1)
                currentCorrect.push(1)
                setCorrectAnswers(currentCorrect)
            } else {
                currentCorrect.push(0)
                setCorrectAnswers(currentCorrect)
            }
            setCurrentQuestion(prev => prev + 1)
            setChecking(false)
            setSelectedOptionIdx(null)
        }, 3000)
    }

    const handleOptionClick = (optionIdx: number) => {
        setSelectedOptionIdx(optionIdx)
    }

    const renderAnswerSelection = () => {
        return question.options.map((option, idx) => (
            <div key={idx} className='trivia-option' onClick={() => handleOptionClick(idx)}>
                <span className={selectedOptionIdx === idx ? 'selected' : ''}>⟐</span>
                <span>{option}</span>
            </div>
        ))
    }

    const renderCard = () => {
        return checking ? (
            <div className="fairy-dust-container">
                <div className="fairy-dust particle-1">✦</div>
                <div className="fairy-dust particle-2">✦</div>
                <div className="fairy-dust particle-3">✦</div>
                <div className="fairy-dust particle-4">✦</div>
                <div className="fairy-dust particle-5">✦</div>
            </div>
        ) : (
            <>
                <h2>{question.question}</h2>
                <h4>Source: {question.source}</h4>
                <div className="trivia-option-group">
                    {renderAnswerSelection()}
                </div>
                <button className="submit-btn" onClick={handleSubmitClick}>Submit</button>
            </>
        )
    }

    return (
        <div className="trivia-cards">
            <div className="trivia-card">
                {renderCard()}
            </div>
        </div>
    )
}

export default TriviaCards;