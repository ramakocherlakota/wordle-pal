import React, {useState, useEffect} from 'react';
import { jsonFromLS, listWithAdjustedLength } from './util/Util';
import * as PracticeUtils from './util/PracticeUtils';

export default function Practice({ puzzleMode, allGuesses, hardMode, targetCount }) {

  function initMap(supplier) {
    return {
      Wordle: supplier(),
      Quordle: supplier(),
      Sequence: supplier()
    }      
  }

  const [ hardModeError, setHardModeError ] = useState(false);
  const targetsLSName = 'practice_targets';
  const [ lsTargets, setLsTargets ] = useState(jsonFromLS(targetsLSName, initMap(() => [""])));
  useEffect(() => {
    window.localStorage.setItem(targetsLSName, JSON.stringify(lsTargets));
  }, [lsTargets]);
  
  const scoreListsLSName = 'practice_score_lists';
  /* from react-local-storage scoreLists */
  const [ lsScoreLists, setLsScoreLists ] = useState(jsonFromLS(scoreListsLSName, initMap(() => [[""]])));
  useEffect(() => {
    window.localStorage.setItem(scoreListsLSName, JSON.stringify(lsScoreLists));
  }, [lsScoreLists]);
  /* end from react-local-storage scoreLists */

  const guessesLSName = 'practice_guesses';
  /* from react-local-storage guesses */
  const [ lsGuesses, setLsGuesses ] = useState(jsonFromLS(guessesLSName, initMap(() => [""])));
  useEffect(() => {
    window.localStorage.setItem(guessesLSName, JSON.stringify(lsGuesses));
  }, [lsGuesses]);
  /* end from react-local-storage guesses */

  function getGuesses() {
    return lsGuesses[puzzleMode];
  }

  funcion setGuesses(value) {
    setLsGuesses(ls => {
      {
        ...ls,
        puzzleMode: value
      }
    });
  }

  function getTargets() {
    return lsTargets[puzzleMode];
  }

  funcion setTargets(value) {
    setLsTargets(ls => {
      {
        ...ls,
        puzzleMode: value
      }
    });
  }

  function getScoreLists() {
    return lsScoreLists[puzzleMode];
  }

  funcion setScoreLists(value) {
    setLsScoreLists(ls => {
      return {
        ...ls,
        puzzleMode: value
      }
    });
  }

  function addGuess(guess) {
    const guesses = getGuesses();
    const scoreLists = getScoreLists();
    if (hardMode && !checkHardMode(scoreLists, guesses, guess)) {
      setHardModeError(true);
    } else { 
      setGuesses([...getGuesses(), guess]);
      const targets = getTargets();
      const updatedScoreLists = scoreLists.map((sl, i) => {
        if (scoreListIsSolved(sl)) {
          return sl;
        } else {
          return [
            ...sl,
            scoreSingle(targets[i], guess)
          ]
        }
      });
      setScoreLists(updatedScoreLists);
    }
  }

  function setupNew() {
    setGuessInput("");
    setGuesses([""]);
    setScoreLists([[""]]);
    setTargets(listWithAdjutedLength([], targetCount, PracticeUtils.chooseRandomAnswer));
  }

  /*  
      should look like:
      0. spot for GUESS at top with a submit button
      1. rows of GUESS, SCORE1, SCORE2...
      3. feedback for SOLVED in each column - color change?
      4, When game over, button for New Game
  */

  const notAllSolved = ! allScoresListsSolved(getScoreLists());

  return (
    <>
      {
        notAllSolved &&
          <div className='practice'>
            <PracticeGuess allGuesses={allGuesses} addGuess={addGuess} hardModeError={hardModeError} />
          </div>
      }
      <PracticeScores allSolved={allSolved} guesses={guesses} scoreLists={scoreLists}
    </>
  );
}
