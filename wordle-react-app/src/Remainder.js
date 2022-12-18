import React, { useState, useEffect } from 'react';
import GuessScores from './GuessScores';

export default function Remainder({setRequest, setHeaders, setShowQueryButton, hideResults}) {
    const [ guessScores, setGuessScores ] = useState([{guess:"", score:""}])

    function getRequest(gs) {
        const guess_scores = gs.map((obj) => [obj.guess, obj.score]);
        return {
            operation: "remaining_answers",
            guess_scores: guess_scores
        }
    }

    useEffect(() => {
        hideResults();
        setHeaders(["word"]);
        const completeGuessScores = guessScores.filter((guessScore) => {
            return guessScore['score'] !== '' && guessScore['guess'] !== '';
        });
        if (completeGuessScores.length === guessScores.length) {
            setShowQueryButton(true);
            setRequest(getRequest(completeGuessScores));
        } else {
            setShowQueryButton(false);
        }
    }, [guessScores]);

    return (
        <>
            <GuessScores guessScores={guessScores} setGuessScores={setGuessScores}  />
        </>);
}
