import React from 'react';
import PopupDoc from './PopupDoc';
import Autofill from './Autofill';
import ScoreOptions from './data/ScoreOptions';

export default function ScoreSelect({ value, setValue }) {
  const scoreOptions = ScoreOptions();
  const optionFunc = () => scoreOptions;

  return (
    <PopupDoc doc=<div>B? W? Dash?<br/><br/>We use the old MasterMind scoring system - a B (black) peg for a letter in the correct position, a W (white) peg for a correct letter in the wrong position.  <br/><br/>So 'B-W--' means the first letter is correct and the third letter is in the answer but in a different position.</div>>
      <Autofill placeholder="Score..."
                value={value}
                initialOptions={scoreOptions}
                optionFunc={optionFunc}
                setValue={setValue} />
    </PopupDoc>
    );
}
