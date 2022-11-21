import React, { useState } from 'react';
import GuessScores from './GuessScores';

export default function Remainder({answers, scores, setLoading}) {
    const [ guessScores, setGuessScores ] = useState([{guess:"", score:""}])

    return <GuessScores guessScores={guessScores} setGuessScores={setGuessScores} setLoading={setLoading} />
}
