import React, { useState, useEffect } from 'react';
import GuessScores from './GuessScores';
import Button from 'react-bootstrap/Button';
import Results from './Results';
import {listOfEmptyStrings, listWithAdjustedLength} from './Util';

export default function QueryGuessScores({ guesses, setGuesses, scoreLists, setScoreLists, operation, headers, headerLabels, guessCount, targetCount, children, hardMode }) {
  const [ showQueryButton, setShowQueryButton ] = useState(false);
  const [ showResults, setShowResults ] = useState(false);
  const [ request, setRequest ] = useState(undefined);

  useEffect(() => {
    setScoreLists((t) => listWithAdjustedLength(t, targetCount, 
                                                () => listOfEmptyStrings(guesses.length)))
  }, [targetCount, setScoreLists]);

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
        count: guessCount,
        hard_mode: hardMode,
        guesses,
        score_lists: scoreLists
      });
    } else {
      setShowQueryButton(false);
    }
  }, [guesses, scoreLists, guessCount, operation, hardMode]);

  function callQuery() {
    setShowResults(true);
    setShowQueryButton(false);
  }

  return (
    <>
      <GuessScores guesses={guesses} setGuesses={setGuesses} scoreLists={scoreLists} setScoreLists={setScoreLists} targetCount={targetCount} />
      {children}
      {showQueryButton && <Button onClick={callQuery}>Go</Button>}
      {showResults && <Results request={request} headerLabels={headerLabels} headers={headers} />}
    </>);
}
