import React, { useState, useEffect } from 'react';
import GuessScores from './GuessScores';
import Button from 'react-bootstrap/Button';
import Results from './Results';
import {listOfEmptyStrings, listWithAdjustedLength} from './Util';

export default function QueryGuessScores({ guesses, setGuesses, setGuessCount, scoreLists, setScoreLists, operation, headers, headerLabels, bestGuessCount, targetCount, children, hardMode }) {
  const [ showQueryButton, setShowQueryButton ] = useState(false);
  const [ showResults, setShowResults ] = useState(false);
  const [ request, setRequest ] = useState(undefined);

  useEffect(() => {
    setShowResults(false);
    const guessesComplete = guesses.filter((guess) => guess.length === 0).length === 0;
    const scoreListsComplete = !(scoreLists.filter((scoreList) => {
      return scoreList.filter((score) => {
        return score.length === 0;
      }).length > 0;
    }).length > 0);

    if (scoreListsComplete && guessesComplete) {
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
  }, [guesses, scoreLists, bestGuessCount, operation, hardMode]);

  function callQuery() {
    setShowResults(true);
    setShowQueryButton(false);
  }

  return (
    <>
      <GuessScores guesses={guesses} setGuesses={setGuesses} setGuessCount={setGuessCount} scoreLists={scoreLists} setScoreLists={setScoreLists} targetCount={targetCount} />
      {children}
      {showQueryButton && <Button onClick={callQuery}>Go</Button>}
      {showResults && <Results request={request} headerLabels={headerLabels} headers={headers} />}
    </>);
}
