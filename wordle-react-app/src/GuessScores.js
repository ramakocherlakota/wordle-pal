import React, { useEffect } from 'react';
import GuessScorePair from './GuessScorePair';
import Button from 'react-bootstrap/Button';
import { ReactComponent as PlusIcon } from './plus-circle.svg';
import { listWithAdjustedLength, listOfEmptyStrings, replaceInList } from './Util';

export default function GuessScores({guesses, setGuesses, scoreLists, setScoreLists, targetCount}) {

  useEffect(() => {
    setScoreLists((sl) => listWithAdjustedLength(sl, targetCount, 
                                                 () => listOfEmptyStrings(guesses.length)));
  }, [targetCount, guesses, setScoreLists]);

  const setGuess = function(index) {
    return function(guess) {
      setGuess((gs) => replaceInList(gs, guess, index));
    }
  }

  const setScores = function(guessNum) {
    return function(newScores) {
      setScoreLists((sl) => scoreLists.map((scoreList, i) => {
        return replaceInList(scoreList, newScores[i], guessNum);
      }));
    }
  }

  const deleter = function(index) {
    return function() {
      const newGuesses = guesses.filter((guess, idx) => {
        return idx !== index;
      });
      setGuesses(newGuesses);

      const newScoreLists = scoreLists.filter((scoreList, idx) => {
        return idx !== index;
      });
      setScoreLists(newScoreLists);
    }
  };

  const adder = function() {
    setGuesses(listWithAdjustedLength(guesses, guesses.length + 1));
  };

  return (
    <>
      {guesses && scoreLists && guesses.map((guess, index) => {
        const scores = scoreLists.map((sl) => sl[index]);
        return <GuessScorePair key={index} scores={scores} guess={guess} setScores={setScores(index)} setGuess={setGuess(index)} deleter={deleter(index)} adder={adder} />
      }
      )}
      {(!guesses || guesses.length === 0) && (
       <div className='row'>
           <div className='col' align='center'><Button onClick={adder} ><PlusIcon/></Button></div>    
       </div>
      )   
      }
    </>
  );
}
