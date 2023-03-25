import React from 'react';
import GuessSelect from './GuessSelect';
import { replaceInList } from './util/Util';

export default function StartWith({allGuesses, startWith, setStartWith}) {

  function setStartWithAt(index) {
    return function(opt) {
      setStartWith((sw) => replaceInList(sw, opt, index));
    }
  }

  return (
    <>
      {startWith.map((sw, index) => 
        <div className="row" key={index}>
          <div className="col">
            <GuessSelect allGuesses={allGuesses} onChange={setStartWithAt(index)} value={sw} placeholder="Starting..."/>
          </div>
        </div>
      )}
    </>
  );
}
