import React from 'react';
import Autofill from './Autofill';
import ScoreOptions from './data/ScoreOptions';

export default function ScoreSelect({ value, setValue }) {
  const scoreOptions = ScoreOptions();
  const optionFunc = (input) => {
    const matches = scoreOptions.filter(o => o.toLowerCase().startsWith(input.toLowerCase()));
    return ["", ...matches];
  }

  return (
    <Autofill placeholder="Score..."
              value={value}
              initialOptions={scoreOptions}
              optionFunc={optionFunc}
              setValue={setValue} />
    );
}
