import React, {useState, useEffect} from 'react';
import WordSelect from './WordSelect';

import GuessOptions from './data/GuessOptions';
import AnswerOptions from './data/AnswerOptions';

export default function GuessSelect({ allGuesses, value, onChange, placeholder }) {
  const [ options, setOptions ] = useState(allGuesses ? GuessOptions() : AnswerOptions());
  const [ doc, setDoc ] = useState("");

  useEffect(() => {
    setOptions(allGuesses ? GuessOptions() : AnswerOptions());
    setDoc(allGuesses 
           ? <div>Start typing in the text area and it will auto-complete.  All words from the 12947 possible Wordle guesss are allowed.</div>
           : <div>Start typing in the text area and it will auto-complete.  Only words from the 2315 possible Wordle answers are allowed.</div>);
  }, [allGuesses]);

  return (
    <WordSelect options={options} value={value} onChange={onChange} placeholder={placeholder} doc={doc} />
  );
}
