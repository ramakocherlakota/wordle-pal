import React from 'react';
import GuessSelect from './GuessSelect';
import Button from '@mui/material/Button';

export default function PracticeGuess({ allGuesses, addGuess, guessInput, setGuessInput }) {
  function handleGuessSelect() {
    if (guessInput) {
      addGuess(guessInput);
      setGuessInput("");
    }
  }

  return (
    <div className='practice-guess-block'>
      <div className='practice-guess-input'>
        <GuessSelect value={guessInput} placeholder="Guess..." allGuesses={allGuesses} onChange={setGuessInput} />
      </div>
      <div className='practice-guess-submit'>
        <Button variant="submit" onClick={handleGuessSelect} disabled={!guessInput}  >Submit</Button>
      </div>
    </div>
  );
}
