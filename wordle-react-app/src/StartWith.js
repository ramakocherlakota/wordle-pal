import React from 'react';
import { ReactComponent as TrashIcon } from './trash.svg';
import { ReactComponent as PlusIcon } from './plus-circle.svg';
import GuessSelect from './GuessSelect';
import './add-delete-buttons.scss';
import { addAt, deleteAt, replaceInList } from './Util';

export default function StartWith({allGuesses, startWith, setStartWith}) {

  function deleteRow(index) {
    return function() {
      setStartWith((sw) => deleteAt(sw, index));
    }
  }

  function setStartWithAt(index) {
    return function(opt) {
      setStartWith((sw) => replaceInList(sw, (opt && opt.value), index));
    }
  }

  function addRow(index) {
    return function() {
      setStartWith((sw) => addAt(sw, index));
    }
  }

  return (
    <>
      {startWith.map((sw, index) => 
        <div className="row" key={index}>
          <div className="col">
            <GuessSelect allGuesses={allGuesses} onChange={setStartWithAt(index)} value={sw} placeholder="Starting..."/>
          </div>
          <div className='col'>
            <a className="add-delete-button" onClick={deleteRow(index)} ><TrashIcon className="icon" /></a>
            <a className="add-delete-button" onClick={addRow(index)} ><PlusIcon className="icon"/></a>
          </div>
        </div>
      )}
      <div className='row' key='-1'>
        <div className='col'>
          <a className="add-delete-button" onClick={addRow(startWith.length)} ><PlusIcon className="icon"/></a>
        </div>
      </div>
    </>
  );
}
