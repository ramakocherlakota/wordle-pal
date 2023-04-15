import React, {useState} from 'react';
import QueryGuessScores from './QueryGuessScores';

export default function Guess({allGuesses, guesses, setGuesses, scoreLists, setScoreLists, targetCount, hardMode}) {
  const headers = ["rank", "guess", "uncertainty_before_guess", "expected_uncertainty_after_guess", "compatible"];
  const headerLabels = {
    rank : "Rank",
    guess : "Guess",
    uncertainty_before_guess : "Prior Uncertainty",
    expected_uncertainty_after_guess : "Expected Uncertainty",
    compatible: "Hard Mode Compatible"
  }
  const headerDocs = {
    uncertainty_before_guess: <div>Uncertainty (in bits) about the solution prior to this guess being made</div>,
    expected_uncertainty_after_guess: <div>Expected value of the uncertainty after this guess is made and a score is returned.  Lower values indicate less uncertainty and are better!</div>
  };

  const [ output, setOutput ] = useState([]);
  const [ error, setError ] = useState("");

  return (
    <QueryGuessScores allGuesses={allGuesses} operation="qguess" headers={ headers } headerLabels={headerLabels} headerDocs={headerDocs} guesses={guesses} setGuesses={setGuesses}  scoreLists={scoreLists} setScoreLists={setScoreLists} hardMode={hardMode} targetCount={targetCount} output={output} setOutput={setOutput} error={error} setError={setError} />
  );
}
