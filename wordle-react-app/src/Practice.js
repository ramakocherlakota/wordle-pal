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

  function setGuesses(value) {
    setlsGuesses[puzzleMode, value];
  }

  function getTargets() {
    return lsTargets[puzzleMode];
  }

  function setTargets(value) {
    setlsTargets[puzzleMode, value];
  }

  function getScoreLists() {
    return lsScoreLists[puzzleMode];
  }

  function setScoreLists(value) {
    setlsScoreLists[puzzleMode, value];
  }

  const [ guessInput, setGuessInput ] = useState("");
  
  function setupNew() {
    setGuessInput("");
    setGuesses([""]);
    setScoreLists([[""]]);
    setTargets(listWithAdjutedLength([], targetCount, PracticeUtils.chooseRandomAnswer));
  }

  function isSolved(col) {

  }


  /*  
      should look like:
      0. spot for GUESS at top with a submit button
      1. rows of GUESS, SCORE1, SCORE2...
      2. in each row a link to the luck panel active when puzzle is solved
      3. feedback for SOLVED in each column - color change?
      4, button for new game - confirm if current game in progress
   */
}
