import React from 'react';
import CheckboxRow from './CheckboxRow';

export default function AllGuessesRow({ allGuesses, setAllGuesses }) {
  const doc = <div>
                Wordle has a list of 2315 "answer" words, which are common five letter words excluding things like plurals and obscurisms like <a href="https://www.google.com/search?q=abmho" target="_blank" rel="noreferrer">abmho</a>.  These are the only ones that show up as solutions to Wordles.  It does, however, allow guesses to come from a list of 12947 "guess" words, which include the plurals and obscurisms.  <br/><br/>This checkbox controls whether or not Wordle Pal considers all guess words in its calculations (which takes longer) or only takes guesses from the smaller answer word list (which is faster and generally almost as good).
              </div>;
    return <CheckboxRow value={allGuesses} setValue={setAllGuesses} label="Allow All Guesses" doc={doc} />
}
