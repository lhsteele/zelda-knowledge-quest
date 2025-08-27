import { type FunctionComponent } from "react"
import Triforce from '../../assets/triforce.svg?react'
import './TriforceLoader.css'

const TriforceLoader:FunctionComponent = () => {
    return (
        <div className="triforce-loader">
            <Triforce />
            <p className="loader-text">Gathering ancient knowledge...</p>
        </div>
      );
}

export default TriforceLoader