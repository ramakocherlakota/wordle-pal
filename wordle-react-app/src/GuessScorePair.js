import React from 'react';

import { ReactComponent as TrashIcon } from './trash.svg';
import { ReactComponent as PlusIcon } from './plus-circle.svg';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';

import {answerOptions, scoreOptions} from './Data';

export default function GuessScorePair({score, guess, setScore, setGuess, deleter, adder}) {
  const setScoreHandler = (s) => {
    setScore(s.value);
  }

  const setGuessHandler = (a) => {
    setGuess(a.value);
  }

  return (
    <div className="row">
      <div className="col">
        <Select options={answerOptions} placeholder="Guess..." onChange={setGuessHandler} value={answerOptions.filter(option=>option.value === guess)} /> 
      </div>
      <div className="col">
        <Select options={scoreOptions} placeholder="Score..." onChange={setScoreHandler}  value={scoreOptions.filter(option=>option.label === score)} />
      </div>
      <div className='col'>
        <div className='row'>
           <div className='col'>
          {deleter &&
           <Button onClick={deleter} size="sm"><TrashIcon/></Button>
          }
           </div>
          {adder &&
           <div className='col'><Button onClick={adder} size="sm"><PlusIcon/></Button></div>
          }
        </div>
      </div>
    </div>);
}
