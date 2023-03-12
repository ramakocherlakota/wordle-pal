import React from 'react';
import PopupDoc from './PopupDoc';
import DataSelect from './DataSelect';
import ScoreOptions from './data/ScoreOptions';

export default function ScoreSelect({ value, setValue }) {
  const scoreOptions = ScoreOptions();

  return (
    <PopupDoc doc=<div>B? W? Dash?<br/><br/>We use the old MasterMind scoring system - a B (black) peg for a letter in the correct position, a W (white) peg for a correct letter in the wrong position.  <br/><br/>So 'B-W--' means the first letter is correct and the third letter is in the answer but in a different position.</div>>
      <DataSelect placeholder="Score..."
                  value={value}
                  options={()=>scoreOptions}
                  showList={(input) => input.length > 0 && input.length < 5}
                  setValue={setValue} />
    </PopupDoc>
    );
}
