import { type FunctionComponent, useState } from "react";
import Progress from '../Progress/Progress'
import TriviaCards from '../TriviaCards/TriviaCards'
import TriforceLoader from "../TriforceLoader/TriforceLoader";
import "./TriviaContainer.css"
import type { QuestionType } from "../../services/types";

export type TriviaContainerProps = {
    loading: boolean;
    questions: QuestionType[];
}

const scoreMap: Record<string, string> = {
    10: 'Princess Zelda! (wisdom)',
    9: 'Link! (hero)',
    8: 'Sheik! (knowledge)',
    7: 'Impa! (scholar)',
    6: 'Saria! (forest sage)',
    0: 'a friendly Kokiri! (still learning)'
}

const TriviaContainer:FunctionComponent<TriviaContainerProps> = ({ loading, questions }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [correctAnswers, setCorrectAnswers] = useState(0)

    const renderScores = () => {
        const score = correctAnswers.toString()
        return scoreMap[score] ? <div className="slate-text">{`You are ${scoreMap[score]}`}</div> : <div>{`You are ${scoreMap[0]}`}</div>
    }

    const renderContent = () => {
        if (loading) {
            return <TriforceLoader />
        } else if (currentQuestion > 9) {
            return (
                <div className="sheikah-slate">
                    {renderScores()}
                </div>
            )
        } else {
            return (
                <div className="trivia-container">
                    <Progress currentHearts={currentQuestion}/>
                    <TriviaCards setCurrentQuestion={setCurrentQuestion} question={questions[currentQuestion]} setCorrectAnswers={setCorrectAnswers}/>
                </div>
            )
        }
    }

    return (
        <>
            {renderContent()}
        </>
    )
}

export default TriviaContainer;