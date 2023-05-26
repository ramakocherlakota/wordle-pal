import React, {useState, useEffect} from 'react';
import { jsonFromLS } from './util/Util';

export default function Practice({ puzzleMode, allGuesses, hardMode }) {

  const targetsLSName = `targets_${puzzleMode}`;
  /* from react-local-storage targets */
  const [ targets, setTargets ] = useState(jsonFromLS(targetsLSName, [""]));
  useEffect(() => {
    window.localStorage.setItem(targetsLSName, JSON.stringify(targets));
  }, [targets]);
  /* end from react-local-storage targets */
  
  const scoreListsLSName = `score_lists_${puzzleMode}`;
  /* from react-local-storage scoreLists */
  const [ scoreLists, setScoreLists ] = useState(jsonFromLS(scoreListsLSName, [[""]]));
  useEffect(() => {
    window.localStorage.setItem(scoreListsLSName, JSON.stringify(scoreLists));
  }, [scoreLists]);
  /* end from react-local-storage scoreLists */

  const guessesLSName = `guesses_${puzzleMode}`;
  /* from react-local-storage guesses */
  const [ guesses, setGuesses ] = useState(jsonFromLS(guessesLSName, [""]));
  useEffect(() => {
    window.localStorage.setItem(guessesLSName, JSON.stringify(guesses));
  }, [guesses]);
  /* end from react-local-storage guesses */



  function setupNew() {

  }

  function isSolved() {

  }

}
