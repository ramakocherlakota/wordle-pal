import React, {useState} from 'react';
import QueryGuessScores from './QueryGuessScores';
import Select from 'react-select';

import {countOptions} from './Data';

export default function Guess({guessScores, setGuessScores}) {
    const [count, setCount] = useState(5);
    const headers = ["guess", "uncertainty_before_guess", "expected_uncertainty_after_guess", "compatible"];
    const setCountHandler = (a) => {
        setCount(a.value);
    }
    const headerLabels = {
        guess : "Guess",
        uncertainty_before_guess : "Prior Uncertainty",
        expected_uncertainty_after_guess : "Expected Uncertainty",
        compatible: "Hard Mode Compatible"
    }
    return (
        <>
            <QueryGuessScores operation="guess" headers={ headers } headerLabels={headerLabels} guessScores={guessScores} setGuessScores={setGuessScores} count={count} >
                <Select options={countOptions} onChange={setCountHandler} value={countOptions.filter(option=>option.value === count)} />
            </QueryGuessScores>
        </>
    );
}
