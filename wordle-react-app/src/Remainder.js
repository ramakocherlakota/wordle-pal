import React, { useState, useEffect } from 'react';
import GuessScores from './GuessScores';
import Button from 'react-bootstrap/Button';
import Results from './Results';

export default function Remainder() {
    const [ showQueryButton, setShowQueryButton ] = useState(false);
    const [ showResults, setShowResults ] = useState(false);
    const [ request, setRequest ] = useState(undefined);
    const [ headers, setHeaders ] = useState(undefined);

    const hideResults = () => setShowResults(false);
    const unhideResults = () => setShowResults(true);
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
            {showQueryButton && <Button onClick={unhideResults} className="query-button">Query</Button>}
            {showResults && <Results request={request} headers={headers} />}
        </>);
}
