import React, {useState, useEffect} from 'react';
import { jsonFromLS, listWithAdjustedLength } from './util/Util';
import PracticeGuess from './PracticeGuess';
import PracticeScores from './PracticeScores';
import Button from '@mui/material/Button';

import {
  checkHardMode,
  scoreListIsSolved,
  scoreSingle,
  allScoresListsSolved,
  chooseRandomAnswer
} from './util/PracticeUtils';

export default function Practice({ setPane, puzzleMode, allGuesses, hardMode, targetCount, maxGuessCounts, setGlobalGuesses, setGlobalTargets }) {

  function initMap(supplier) {
    return {
      Wordle: supplier(),
      Quordle: supplier(),
      Sequence: supplier()
    }      
  }

  const [ hardModeError, setHardModeError ] = useState(false);
  const [ guessInput, setGuessInput ] = useState("");
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
    setLsGuesses(ls => {
      return {
        ...ls,
        [puzzleMode]: value
      }
    });
  }

  function getTargets() {
    return lsTargets[puzzleMode];
  }

  function setTargets(value) {
    setLsTargets(ls => {
      const newTargets = {
        ...ls,
        [puzzleMode]: value
      };
      return newTargets;
    });
  }

  function getScoreLists() {
    return lsScoreLists[puzzleMode];
  }

  function setScoreLists(value) {
    setLsScoreLists(ls => {
      return {
        ...ls,
        [puzzleMode]: value
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

  function newGame() {
    setGuessInput("");
    setGuesses([""]);
    setScoreLists([[""]]);
    const newTargets = listWithAdjustedLength([], targetCount, chooseRandomAnswer);
    setTargets(newTargets);
  }

  /*  
      should look like:
      0. spot for GUESS at top with a submit button
      1. rows of GUESS, SCORE1, SCORE2...
      3. feedback for SOLVED in each column - color change?
      4, When game over, button for New Game
      5. need alerts (https://mui.com/material-ui/react-dialog/) for hard mode error and querying new game
      6. feedback for out of guesses - dialog?
  */

  const outOfGuesses = getGuesses() && getGuesses().length >= maxGuessCounts[puzzleMode];
  const finished = outOfGuesses || allScoresListsSolved(getScoreLists());
  function gotoLuck() {
    setGlobalGuesses(getGuesses());
    setGlobalTargets(getTargets());
    setPane("luck");
  }

  function queryNewGame() {
    newGame();
  }

  return (
    <>
      {
        hardModeError &&
          <div className='hard-mode-error'>
            Your guess violates the Hard Mode constraint.  Either choose another guess or disable hard mode in Settings.
          </div>
      }
      {
        finished &&
          <div className='practice'>
            <PracticeGuess guessInput={guessInput} setGuessInput={setGuessInput} allGuesses={allGuesses} addGuess={addGuess} />
          </div>
      }
      <PracticeScores finished={finished} guesses={getGuesses()} scoreLists={getScoreLists()} />
        {finished &&
         <>
           <div className="practice-button" >
             <Button onClick={gotoLuck}>Show Luck</Button>
           </div>
           <div className="practice-button">
             <Button onClick={newGame}>New Game</Button>
           </div>
         </>
        }
        {!finished &&
         <div className="practice-button">
           <Button onClick={queryNewGame}>New Game</Button>
         </div>
        }         
    </>
  );
}
