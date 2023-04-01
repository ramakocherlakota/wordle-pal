import React from 'react';

import GuessSelect from './GuessSelect';
import ScoreSelect from './ScoreSelect';
import './guess-score-pair.scss';
import { replaceInList } from './util/Util';

export default function GuessScorePair({allGuesses, scores, guess, setScores, setGuess}) {

  const setGuessHandler = (a) => {
    setGuess(a);
  }

  function setScoreHandler(idx) {
    return function(s) {
      const newScores = replaceInList(scores, s, idx);
      setScores(newScores);
    }
  }

  return (
    <div className='guess-score-pair'>
      <div className='guess'>
        <GuessSelect allGuesses={allGuesses} placeholder="Guess..." onChange={setGuessHandler} value={guess} /> 
      </div>
      {scores.map((score, idx) => 
        <div key={idx} className="score">
          <ScoreSelect placeholder="Score..." setValue={setScoreHandler(idx)}  value={score} />
        </div>
      )}
    </div>);
}
