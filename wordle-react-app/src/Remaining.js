import React, {useState} from 'react';
import QueryGuessScores from './QueryGuessScores';
import AllGuessesRow from './AllGuessesRow';
import RemainingOutputFormat from './RemainingOutputFormat';

export default function Remaining({ allGuesses, setAllGuesses, guesses, setGuesses, setGuessCount, scoreLists, setScoreLists, hardMode, setHardMode, targetCount }) {

  const [ output, setOutput ] = useState([]);
  const [ error, setError ] = useState("");
  const formatRemainingOutput = (data) => <RemainingOutputFormat {...data} />

  return (
    <>
      <QueryGuessScores allGuesses={allGuesses} guesses={guesses} setGuesses={setGuesses} setGuessCount={setGuessCount} scoreLists={scoreLists} setScoreLists={setScoreLists} operation="qremaining_answers" targetCount={targetCount} output={output} setOutput={setOutput} error={error} setError={setError} outputHandler={formatRemainingOutput} >
        <AllGuessesRow allGuesses={allGuesses} setAllGuesses={setAllGuesses} />
      </QueryGuessScores>
    </>
  );
}
