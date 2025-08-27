import { type FunctionComponent } from 'react';
import './Progress.css'
import FilledHeart from '../../assets/filled-heart.svg?react'
import EmptyHeart from '../../assets/empty-heart.svg?react'

export type ProgressProps = {
    currentHearts: number;
}

const Progress:FunctionComponent<ProgressProps> = ({ currentHearts }) => {
    const renderHearts = () => {
        return Array.from({ length: 10 }).map((_, idx) => {
            const heartIdx = idx + 1
            const isFilled = heartIdx <= currentHearts

            return isFilled ? <FilledHeart key={idx}/> : <EmptyHeart key={idx}/>
        })
    }


    return (
        <div className="progress-container">
            {renderHearts()}
        </div>
    )
}

export default Progress;