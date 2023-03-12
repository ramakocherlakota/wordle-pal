import React from 'react';
import WordSelect from './WordSelect';

import AnswerOptions from './data/AnswerOptions';

export default function AnswerSelect({ value, onChange, placeholder }) {
  return (
    <WordSelect label="Target..." options={AnswerOptions()} value={value} onChange={onChange} placeholder={placeholder} doc=<div>Start typing in the text area and it will auto-complete.  Only words from the 2315 possible Wordle answers are allowed.</div> />
  );
}
