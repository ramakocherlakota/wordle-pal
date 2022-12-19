import React from 'react';
import QueryGuessScores from './QueryGuessScores';

export default function Guess({guessScores, setGuessScores}) {
    const headers = ["guess", "uncertainty_before_guess", "expected_uncertainty_after_guess", "compatible"];
    const headerLabels = {
        guess : "Guess",
        uncertainty_before_guess : "Prior Uncertainty",
        expected_uncertainty_after_guess : "Expected Uncertainty",
        compatible: "Hard Mode"
    }
    return <QueryGuessScores operation="guess" headers={ headers } headerLabels={headerLabels} guessScores={guessScores} setGuessScores={setGuessScores}  />;
}
