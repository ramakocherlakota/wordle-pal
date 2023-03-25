import React, {useState} from 'react';
import QueryGuessScores from './QueryGuessScores';
import RemainingOutputFormat from './RemainingOutputFormat';

export default function Remaining({ allGuesses, guesses, setGuesses, scoreLists, setScoreLists, hardMode, targetCount }) {

  const [ output, setOutput ] = useState([]);
  const [ error, setError ] = useState("");
  const formatRemainingOutput = (data) => <RemainingOutputFormat {...data} />

  return (
    <>
      <QueryGuessScores allGuesses={allGuesses} guesses={guesses} setGuesses={setGuesses} scoreLists={scoreLists} setScoreLists={setScoreLists} operation="qremaining_answers" targetCount={targetCount} output={output} setOutput={setOutput} error={error} setError={setError} outputHandler={formatRemainingOutput} />
    </>
  );
}
