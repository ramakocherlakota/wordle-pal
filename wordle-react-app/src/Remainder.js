import React from 'react';
import QueryGuessScores from './QueryGuessScores';

export default function Remainder({ guesses, setGuesses, setGuessCount, scoreLists, setScoreLists, hardMode, setHardMode, targetCount }) {

  return (
    <QueryGuessScores guesses={guesses} setGuesses={setGuesses} setGuessCount={setGuessCount} scoreLists={scoreLists} setScoreLists={setScoreLists} operation="qremaining_answers" targetCount={targetCount} />
  );
}
