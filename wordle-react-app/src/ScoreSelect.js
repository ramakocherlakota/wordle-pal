import React from 'react';
import DataSelect from './DataSelect';
import PopupDoc from './PopupDoc';
import ScoreOptions from './data/ScoreOptions';

export default function ScoreSelect({ value, onChange }) {
  const scoreOptions = ScoreOptions();

  function inputKeyMapper(inputValue) {
    return inputValue.toLowerCase().replace(/[^a-z]/g, "-");
  }

  return (
    <PopupDoc doc=<div>B? W? Dash?<br/><br/>We use the old MasterMind scoring system - a B (black) peg for a letter in the correct position, a W (white) peg for a correct letter in the wrong position.  <br/><br/>So 'B-W--' means the first letter is correct and the third letter is in the answer but in a different position.</div>>
      <DataSelect options={() => scoreOptions} inputKeyMapper={inputKeyMapper} setValue={onChange} />
    </PopupDoc>
    );
}
