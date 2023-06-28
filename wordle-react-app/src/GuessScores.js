import React from 'react';
import GuessScorePair from './GuessScorePair';
import { replaceInList } from './util/Util';
import './guess-scores.scss';

export default function GuessScores({allGuesses, guesses, setGuesses, setGuessCount, scoreLists, setScoreLists, targetCount, showBW }) {
  const setGuess = function(index) {
    return function(guess) {
      setGuesses((gs) => replaceInList(gs, guess, index));
    }
  }

  const setScores = function(guessNum) {
    return function(newScores) {
      setScoreLists((sls) => sls.map((scoreList, i) => {
        return replaceInList(scoreList, newScores[i], guessNum);
      }));
    }
  }

  return (
    <div className='guess-scores'>
      {guesses && scoreLists && guesses.map((guess, index) => {
        const scores = scoreLists.map((sl) => sl[index]);
        return <GuessScorePair allGuesses={allGuesses} key={index} scores={scores} guess={guess} setScores={setScores(index)} setGuess={setGuess(index)} showBW={showBW} />
      }
      )}
    </div>
  );
}
