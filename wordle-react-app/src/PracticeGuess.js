import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './practice-guess.scss';
import GuessOptions from './data/GuessOptions';
import AnswerOptions from './data/AnswerOptions';

export default function PracticeGuess({ allGuesses, addGuess, guessInput, setGuessInput }) {
  const guessOptions = Object.values(allGuesses? GuessOptions() : AnswerOptions()).flatMap(x => x);
  const [ error, setError ] = useState("");

  function handleGuessSubmit() {
    if (guessInput) {
      if (guessOptions.includes(guessInput)) {
        addGuess(guessInput);
      } else {
        setError(`Not found: ${guessInput}`);
      }
      setGuessInput("");
    }
  }

  function handleInputChange(e) {
    setError("");
    setGuessInput(e.target.value.toLowerCase());
  }

  return (
    <>
      <div className='practice-guess-block'>
        {error &&
         <div className='practice-guess-error'>
           {error}
         </div>
        }
        <div className='practice-guess-input'>
          <TextField autoComplete='off' 
                     inputRef={input => input && input.focus()}
                     value={guessInput} placeholder="Guess..." onChange={handleInputChange} />
          <div className='practice-guess-submit'>
            <Button variant="submit" onClick={handleGuessSubmit}   >Submit</Button>
          </div>
        </div>
      </div>
    </>
  );
}
