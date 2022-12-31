import React from 'react';
import QueryGuessScores from './QueryGuessScores';

export default function Remainder({ guesses, setGuesses, setGuessCount, scoreLists, setScoreLists, hardMode, setHardMode, targetCount }) {

  let headerLabels = {}
  for (let i=1; i<=targetCount; i++) {
    headerLabels[`word_${i}`] = `word_${i}`;
  }
  const headers = Object.keys(headerLabels);

  return (
    <QueryGuessScores guesses={guesses} setGuesses={setGuesses} setGuessCount={setGuessCount} scoreLists={scoreLists} setScoreLists={setScoreLists} operation="qremaining_answers" headers={headers} headerLabels={ headerLabels } targetCount={targetCount} />
  );
}
