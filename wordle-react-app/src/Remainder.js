import React from 'react';
import QueryGuessScores from './QueryGuessScores';

export default function Remainder({ guessScores, setGuessScores, hardMode, setHardMode }) {
    const headerLabels = {"word" : ""};

    return <QueryGuessScores guessScores={guessScores} setGuessScores={setGuessScores} operation="remaining_answers" headers={["word"]} headerLabels={ headerLabels } hardMode={hardMode} />;
}
