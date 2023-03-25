import React from 'react';

import GuessSelect from './GuessSelect';
import ScoreSelect from './ScoreSelect';
import './link-button.scss';
import { replaceInList } from './util/Util';

export default function GuessScorePair({allGuesses, scores, guess, setScores, setGuess}) {

  const setGuessHandler = (a) => {
    setGuess(a);
  }

  function setScoreHandler(idx) {
    return function(s) {
      setScores(replaceInList(scores, s, idx));
    }
  }

  return (
    <div className="row">
      <div className="col">
        <GuessSelect allGuesses={allGuesses} placeholder="Guess..." onChange={setGuessHandler} value={guess} /> 
      </div>
      {scores.map((score, idx) => 
        <div key={idx} className="col">
          <ScoreSelect placeholder="Score..." setValue={setScoreHandler(idx)}  value={score} />
        </div>
      )}
    </div>);
}
