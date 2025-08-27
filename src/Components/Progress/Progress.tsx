import { type FunctionComponent } from 'react';
import './Progress.css'
import FilledHeart from '../../assets/filled-heart.svg?react'
import EmptyHeart from '../../assets/empty-heart.svg?react'
import FilledIncorrectHeart from '../../assets/filled-incorrect-heart.svg?react'

export type ProgressProps = {
    correctAnswers: number[]
}

const Progress:FunctionComponent<ProgressProps> = ({ correctAnswers }) => {
    const renderHearts = () => {
        return Array.from({ length: 10 }).map((_, idx) => {
            const isCorrect = correctAnswers[idx] === 1
            const isIncorrect = correctAnswers[idx] === 0

            if (isCorrect) {
                return <FilledHeart key={idx}/>
            } else if (isIncorrect) {
                return <FilledIncorrectHeart key={idx} />
            } else {
                return <EmptyHeart key={idx}/>
            }
        })
    }


    return (
        <div className="progress-container">
            {renderHearts()}
        </div>
    )
}

export default Progress;