import React, {useState} from 'react';
import QueryGuessScores from './QueryGuessScores';
import RemainingOutputFormat from './RemainingOutputFormat';

export default function Remaining({ allGuesses, guesses, setGuesses, scoreLists, setScoreLists, hardMode, targetCount, sequence, showBW }) {

  const [ output, setOutput ] = useState([]);
  const [ error, setError ] = useState("");
  const formatRemainingOutput = (data) => <RemainingOutputFormat {...data} />

  return (
    <>
      <p>
        Enter your guesses and the scores that came back from Wordle to get a list of remaining possible answers.  To enter scores in non-monochrome mode you click on the letters to cycle between grey (not in the solution), orange (in the correct place) and blue (in the wrong place).
      </p>
      <QueryGuessScores allGuesses={allGuesses} guesses={guesses} setGuesses={setGuesses} scoreLists={scoreLists} setScoreLists={setScoreLists} operation="remaining_answers" targetCount={targetCount} output={output} setOutput={setOutput} error={error} setError={setError} handleOutput={formatRemainingOutput} sequence={sequence} showBW={showBW} />
    </>
  );
}
