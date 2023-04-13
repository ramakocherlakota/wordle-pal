import React, { useState, useEffect } from 'react';
import GuessScores from './GuessScores';
import GoButton from './GoButton';
import Results from './Results';

export default function QueryGuessScores({ allGuesses, guesses, setGuesses, setGuessCount, scoreLists, setScoreLists, operation, headers, headerLabels, headerDocs, bestGuessCount, targetCount, children, hardMode, output, setOutput, error, setError, outputHandler }) {
  const [ loading, setLoading ] = useState(false);
  const [ elapsedTime, setElapsedTime ] = useState(0);
  const [ showQueryButton, setShowQueryButton ] = useState(false);
  const [ showResults, setShowResults ] = useState(false);
  const [ request, setRequest ] = useState(undefined);

  useEffect(() => {
    setShowResults(false);

    function filterCompleted(list) {
      return list.map((it, i) => {
        if (it?.length !== 0) {
          return i;
        } else {
          return "";
        }
      }).filter(x => x !== "");      
    }

    const completedGuesses = filterCompleted(guesses);

    const consistentScoreLists = scoreLists.filter((scoreList) => {
      const completedScores = completedGuesses.filter(i => scoreList[i] !== '');
      return completedScores.length === completedGuesses.length;
    });

    if (consistentScoreLists.length === targetCount) {
      setShowQueryButton(true);
      setRequest({
        operation: operation,
        count: bestGuessCount,
        hard_mode: hardMode,
        guesses,
        scores_list: scoreLists
      });
    } else {
      setShowQueryButton(false);
    }
  }, [allGuesses, guesses, scoreLists, bestGuessCount, operation, hardMode, targetCount]);

  return (
    <>
      <GuessScores allGuesses={allGuesses} guesses={guesses} setGuesses={setGuesses} setGuessCount={setGuessCount} scoreLists={scoreLists} setScoreLists={setScoreLists} targetCount={targetCount} />
      {children}
      <GoButton showQueryButton={showQueryButton} showResults={showResults} setShowQueryButton={setShowQueryButton} setShowResults={setShowResults} loading={loading} elapsedTime={elapsedTime} />
      {showResults && <Results allGuesses={allGuesses} request={request} headerLabels={headerLabels} headerDocs={headerDocs} headers={headers} loading={loading}  setLoading={setLoading} elapsedTime={elapsedTime} setElapsedTime={setElapsedTime} output={output} setOutput={setOutput} error={error} setError={setError} outputHandler={outputHandler} />}
    </>);
}
