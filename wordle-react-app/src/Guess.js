import React, {useState} from 'react';
import QueryGuessScores from './QueryGuessScores';
import HardModeRow from './HardModeRow';
import NumberInput from './NumberInput';

export default function Guess({guessScores, setGuessScores, hardMode, setHardMode}) {
    const [count, setCount] = useState(5);
    const headers = ["guess", "uncertainty_before_guess", "expected_uncertainty_after_guess", "compatible"];
    const headerLabels = {
        guess : "Guess",
        uncertainty_before_guess : "Prior Uncertainty",
        expected_uncertainty_after_guess : "Expected Uncertainty",
        compatible: "Hard Mode Compatible"
    }
    return (
        <>
            <QueryGuessScores operation="guess" headers={ headers } headerLabels={headerLabels} guessScores={guessScores} setGuessScores={setGuessScores} count={count} hardMode={hardMode} >
              <HardModeRow hardMode={hardMode} setHardMode={setHardMode} />
              <NumberInput maxValue={2315} minValue={1} value={count} setValue={setCount} label="Guess Count" />
            </QueryGuessScores>
        </>
    );
}
