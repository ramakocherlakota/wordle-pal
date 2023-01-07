import React from 'react';

import { ReactComponent as TrashIcon } from './trash.svg';
import { ReactComponent as PlusIcon } from './plus-circle.svg';
import GuessSelect from './GuessSelect';
import ScoreSelect from './ScoreSelect';
import './add-delete-buttons.scss';
import './link-button.scss';
import { replaceInList } from './Util';

export default function GuessScorePair({allGuesses, scores, guess, setScores, setGuess, deleter, adder}) {

  const setGuessHandler = (a) => {
    setGuess(a && a.value);
  }

  function setScoreHandler(idx) {
    return function(s) {
      setScores(replaceInList(scores, s.value, idx));
    }
  }

  return (
    <div className="row">
      <div className="col">
        <GuessSelect allGuesses={allGuesses} placeholder="Guess..." onChange={setGuessHandler} value={guess} /> 
      </div>
      {scores.map((score, idx) => 
        <div key={idx} className="col">
          <ScoreSelect placeholder="Score..." onChange={setScoreHandler(idx)}  value={score} />
        </div>
      )}
      <div className='col'>
        <div className='row'>
           <div className='col' align='left'> 
             <button className="link-button add-delete-button" onClick={deleter}><TrashIcon className="icon" /></button>
             {adder && <button className="link-button add-delete-button" onClick={adder}><PlusIcon className="icon" /></button>}
           </div>
        </div>
      </div>
    </div>);
}
