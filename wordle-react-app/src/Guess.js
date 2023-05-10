import React, {useState} from 'react';
import QueryGuessScores from './QueryGuessScores';
import GuessOutputFormat from './GuessOutputFormat';

export default function Guess({allGuesses, guesses, setGuesses, scoreLists, setScoreLists, targetCount, hardMode}) {
  const headers = ["rank", "guess", "uncertainty_before_guess", "expected_uncertainty_after_guess", "compatible"];
  const headerLabels = {
    rank : "Rank",
    guess : "Guess",
    uncertainty_before_guess : "Prior Uncertainty",
    expected_uncertainty_after_guess : "Expected Uncertainty",
    compatible: "Compatible"
  }
  const headerDocs = {
    uncertainty_before_guess: <div>Uncertainty (in bits) about the solution prior to this guess being made</div>,
    expected_uncertainty_after_guess: <div>Expected value of the uncertainty after this guess is made and a score is returned.  Lower values indicate less uncertainty and are better!</div>,
    compatible: <div>Is the guess compatible with what is known so far (would it be a valid Hard Mode guess)?</div>
  };

  const [ output, setOutput ] = useState([]);
  const [ error, setError ] = useState("");
  const formatGuessOutput = (data) => <GuessOutputFormat {...data} />

  return (
    <>
      <p>
        Enter your guesses and the scores that came back from Wordle to get suggestions for your next guess.
      </p>
      <QueryGuessScores allGuesses={allGuesses} operation="guess" headers={ headers } headerLabels={headerLabels} headerDocs={headerDocs} guesses={guesses} setGuesses={setGuesses}  scoreLists={scoreLists} setScoreLists={setScoreLists} hardMode={hardMode} targetCount={targetCount} output={output} setOutput={setOutput} error={error} setError={setError} handleOutput={formatGuessOutput} />
    </>
  );
}
