import React, { useEffect} from 'react';

import AnswerSelect from './AnswerSelect';
import GuessSelect from './GuessSelect';
import './query-target-guess.scss';
import { replaceInList, listWithAdjustedLength } from './util/Util';

export default function QueryTargetGuess( { 
  allGuesses, 
  targets, setTargets,
  guesses, setGuesses,
  targetCount, guessCount }
) {
  
  useEffect(() => {
    setTargets((t) => listWithAdjustedLength(t, targetCount));
  }, [targetCount, setTargets]);

  useEffect(() => {
    setGuesses((g) => listWithAdjustedLength(g, guessCount));
  }, [guessCount, setGuesses]);

  function setTarget(i, newval) {
    setTargets((ts) => replaceInList(ts, newval, i));
  }

  function setTargetHandler(i) {
    return function(a) {
      setTarget(i, a);
    }
  }

  function targetSelects() {
    return targets.map((target, idx) => {
      return (
        <div className='select' key={idx}>
          <AnswerSelect onChange={setTargetHandler(idx)} value={target} placeholder="Target..." />
        </div>
      );
    });
  }

  function setGuess(i, newval) {
    setGuesses((ts) => replaceInList(ts, newval, i));
  }

  function setGuessHandler(i) {
    return function(a) {
      setGuess(i, a);
    }
  }

  function guessSelects() {
    return guesses.map((guess, idx) => {
      return (
        <div className='select' key={idx} >
          <GuessSelect allGuesses={allGuesses} onChange={setGuessHandler(idx)}
                       value={guess} placeholder="Guess..." />
        </div>
      );
    });
  }

  return (
    <>
      Targets
      <div className="targets-guesses" >
        <div className='fields'>
          {targetSelects()}
        </div>
      </div>
      Guesses
      <div className="targets-guesses" >
        <div className="fields">
          {guessSelects()}
        </div>
      </div>
    </>
  );


}
