import React from 'react';
import GuessScorePair from './GuessScorePair';

export default function GuessScores({guessScores,  setGuessScores}) {

  const getGuess = function(guessScore) {
    return guessScore['guess'];
  };

  const getScore = function(guessScore) {
    return guessScore['score'];
  };

  const replaceGuessScore = function(index, guess, score) {
    // copy guessStores to a new value and substitute @index with new value
    const newGuessScores = guessScores.map((guessScore, idx) => {
      if (idx !== index) {
        return guessScore;
      } else {
        return {'guess': guess, 'score' : score};
      }
    });
    setGuessScores(newGuessScores);
  };

  const setGuess = function(index) {
    return function(guess) {
      const score = getScore(guessScores[index]);
      replaceGuessScore(index, guess, score);
    }
  }

  const setScore = function(index) {
    return function(score) {
      const guess = getGuess(guessScores[index]);
      replaceGuessScore(index, guess, score);
    }
  };

  const deleter = function(index) {
    if (guessScores.length > 1) {
      return function() {
        const newGuessScores = guessScores.filter((guessScore, idx) => {
          return idx !== index;
        });
        setGuessScores(newGuessScores);
      }
    } else {
      return null;
    }
  };

  const adder = function(index) {
    if (index === guessScores.length - 1) {
      return function() {
        const newGuessScores = guessScores.concat({guess:"", score:""});
        setGuessScores(newGuessScores);
      }
    } else {
      return null;
    }
  };

  return (
    <>
      {guessScores.map((guessScore, index) => 
        <GuessScorePair key={index} score={getScore(guessScore)} guess={getGuess(guessScore)} setScore={setScore(index)} setGuess={setGuess(index)} deleter={deleter(index)} adder={adder(index)} />
      )}
    </>
  );
}
