import React from 'react';

import { ReactComponent as TrashIcon } from './trash.svg';
import { ReactComponent as PlusIcon } from './plus-circle.svg';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import './add-delete-buttons.scss';
import { replaceInList } from './Util';

import {answerOptions, scoreOptions} from './Data';

export default function GuessScorePair({scores, guess, setScores, setGuess, deleter, adder}) {

  const setGuessHandler = (a) => {
    setGuess(a.value);
  }

  function setScoreHandler(idx) {
    return function(s) {
      setScores(replaceInList(scores, s.value, idx));
    }
  }

  return (
    <div className="row">
      <div className="col">
        <Select options={answerOptions} placeholder="Guess..." onChange={setGuessHandler} value={answerOptions.filter(option=>option.value === guess)} /> 
      </div>
      {scores.map((score, idx) => 
        <div key={idx} className="col">
          <Select options={scoreOptions} placeholder="Score..." onChange={setScoreHandler(idx)}  value={scoreOptions.filter(option=>option.label === score)} />
        </div>
      )}
      <div className='col'>
        <div className='row'>
           <div className='col' align='left'>
             <Button className="add-delete-button" onClick={deleter} size="sm"><TrashIcon/></Button>
             {adder && <Button className="add-delete-button" onClick={adder} size="sm"><PlusIcon/></Button>}
           </div>
        </div>
      </div>
    </div>);
}
