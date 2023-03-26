import React from 'react';
import Autofill from './Autofill';
import ScoreOptions from './data/ScoreOptions';

export default function ScoreSelect({ value, setValue }) {
  const scoreOptions = ScoreOptions();
  const optionFunc = () => scoreOptions;

  return (
    <Autofill placeholder="Score..."
              value={value}
              initialOptions={scoreOptions}
              optionFunc={optionFunc}
              setValue={setValue} />
    );
}
