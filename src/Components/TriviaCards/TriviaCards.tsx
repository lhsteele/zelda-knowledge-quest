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
    const [incorrect, setIncorrect] = useState(false)

    const handleNextClick = () => {
        setIncorrect(false)
        setCurrentQuestion(prev => prev + 1)
    }
    
    const handleSubmitClick = () => {
        setChecking(true)
        setTimeout(() => {
            const currentCorrect = [...correctAnswers]
            if (selectedOptionIdx === question.correct) {
                setTotalCorrect(prev => prev + 1)
                currentCorrect.push(1)
                setCurrentQuestion(prev => prev + 1)
                setIncorrect(false)
            } else {
                setIncorrect(true)
                currentCorrect.push(0)
            }
            setCorrectAnswers(currentCorrect)
            setChecking(false)
            setSelectedOptionIdx(null)
        }, 3000)
    }

    const handleOptionClick = (optionIdx: number) => {
        setSelectedOptionIdx(optionIdx)
    }

    const renderAnswerSelection = () => {
        return question.options.map((option, idx) => {
            const isCorrectAnswer = incorrect && idx === question.correct
            return (
                <div key={idx} className='trivia-option' onClick={() => handleOptionClick(idx)}>
                    <span className={`trivia-option-marker ${selectedOptionIdx === idx ? 'selected' : ''} ${isCorrectAnswer ? 'trivia-option-marker-correct' : ''}`}>⟐</span>
                    <span>{option}</span>
                </div>
            )
        })
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
                <div className="trivia-option-group">
                    {renderAnswerSelection()}
                </div>
                <button className="submit-btn" onClick={incorrect ? handleNextClick : handleSubmitClick}>{incorrect ? 'Next' : 'Submit'}</button>
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