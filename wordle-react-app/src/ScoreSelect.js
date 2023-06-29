import React from 'react';
import Autofill from './Autofill';
import ColoredScore from './ColoredScore';
import ScoreOptions from './data/ScoreOptions';

export default function ScoreSelect({ value, setValue, showBW, guess }) {
  if (showBW) {
    const scoreOptions = ScoreOptions();
    const optionFunc = () => scoreOptions;

    return (
      <Autofill placeholder="Score..."
                value={value}
                initialOptions={scoreOptions}
                optionFunc={optionFunc}
                setValue={setValue} />
    );

  } else {
    return <ColoredScore guess={guess} score={value} setScore={setValue} />
  }
}
