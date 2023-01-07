import React from 'react';
import QueryGuessScores from './QueryGuessScores';
import AllGuessesRow from './AllGuessesRow';

export default function Remainder({ allGuesses, setAllGuesses, guesses, setGuesses, setGuessCount, scoreLists, setScoreLists, hardMode, setHardMode, targetCount }) {

  return (
    <>
      <QueryGuessScores allGuesses={allGuesses} guesses={guesses} setGuesses={setGuesses} setGuessCount={setGuessCount} scoreLists={scoreLists} setScoreLists={setScoreLists} operation="qremaining_answers" targetCount={targetCount} >
        <AllGuessesRow allGuesses={allGuesses} setAllGuesses={setAllGuesses} />
      </QueryGuessScores>
    </>
  );
}
