import React from 'react';
import GuessScorePair from './GuessScorePair';
import Button from 'react-bootstrap/Button';
import { ReactComponent as PlusIcon } from './plus-circle.svg';
import { deleteAt, replaceInList } from './Util';

export default function GuessScores({guesses, setGuesses, setGuessCount, scoreLists, setScoreLists, targetCount}) {

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

  const deleter = function(index) {
    return function() {
      setGuesses((gs) => deleteAt(gs, index));
      setScoreLists((sls) => sls.map((sl) => deleteAt(sl, index)));
      setGuessCount((gs) => gs - 1);
    }
  };

  const adder = function() {
    setGuessCount((gs) => gs + 1);
  };

  return (
    <>
      {guesses && scoreLists && guesses.map((guess, index) => {
        const scores = scoreLists.map((sl) => sl[index]);
        return <GuessScorePair key={index} scores={scores} guess={guess} setScores={setScores(index)} setGuess={setGuess(index)} deleter={deleter(index)} adder={(index === guesses.length -1 ) && adder} />
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
