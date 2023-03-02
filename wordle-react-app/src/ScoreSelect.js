import React from 'react';
import AsyncSelect from 'react-select/async';
import PopupDoc from './PopupDoc';

import ScoreOptions from './data/ScoreOptions';

export default function ScoreSelect({ value, onChange, placeholder }) {
  const scoreOptions = ScoreOptions();

  const filterOptions = (inputValue) => {
    if (inputValue.length > 0) {
      const key = inputValue.toLowerCase().replace(/[^a-z]/g, "-");
      return scoreOptions.filter((i) => i.label.toLowerCase().startsWith(key));
    } else {
      return null;
    }
  }

  function loadOptions(inputValue, callback) {
    setTimeout(() => {
      callback(filterOptions(inputValue));
    }, 100);
  };

  if (value) {
    return (
      <PopupDoc doc=<div>B? W? Dash?<br/><br/>We use the old MasterMind scoring system - a B (black) peg for a letter in the correct position, a W (white) peg for a correct letter in the wrong position.  <br/><br/>So 'B-W--' means the first letter is correct and the third letter is in the answer but in a different position.</div>>
        <AsyncSelect placeholder={placeholder} defaultOptions={scoreOptions} loadOptions={loadOptions} onChange={onChange} value={filterOptions(value)} />
      </PopupDoc>
    )
  } else {
    return null;
  }  
}
