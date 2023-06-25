import React, {useState, useEffect} from 'react';
import { jsonFromLS, listWithAdjustedLength } from './util/Util';
import PracticeGuess from './PracticeGuess';
import PracticeScores from './PracticeScores';
import Button from '@mui/material/Button';
import './practice.scss';

import {
  checkHardMode,
  scoreListIsSolved,
  scoreSingle,
  maxGuessCount,
  chooseRandomAnswer
} from './util/PracticeUtils';

  /*  
      should look like:
      0. spot for GUESS at top with a submit button
      1. rows of GUESS, SCORE1, SCORE2...
      3. feedback for SOLVED in each column - color change?
      4, When game over, button for New Game
      5. need alerts (https://mui.com/material-ui/react-dialog/) for hard mode error and querying new game
      6. feedback for out of guesses - dialog?

      - Want to only display a column up to the point that it is solved
      - if you solve one of them the column should change color and show the target in the top row
      - if you hit the mxGuessCount it should display a Too bad Dialog and have the New Game not query
      - and show the answers
      - if you solve all of them it should display a Success dialog and have the New Game not query
      - maybe instead of using an actual Dialog just have an info box that show up at the top
      - if you click on New Game when you aren't done it should query whether to start afresh
      - and enable the Luck button whenever you are finished
  */

export default function Practice({ setPane, puzzleMode, allGuesses, hardMode, targetCount, maxGuessCounts, setGlobalGuesses, setGlobalTargets }) {

  function initMap(supplier) {
    return {
      Wordle: supplier(),
      Quordle: supplier(),
      Sequence: supplier()
    }      
  }

  const [ message, setMessage ] = useState(null);
  const [ guessInput, setGuessInput ] = useState("");

  const targetsLSName = 'practice_targets';
  const [ lsTargets, setLsTargets ] = useState(jsonFromLS(targetsLSName, initMap(() => [])));
  useEffect(() => {
    window.localStorage.setItem(targetsLSName, JSON.stringify(lsTargets));
  }, [lsTargets]);
  
  const scoreListsLSName = 'practice_score_lists';
  /* from react-local-storage scoreLists */
  const [ lsScoreLists, setLsScoreLists ] = useState(jsonFromLS(scoreListsLSName, initMap(() => [])));
  useEffect(() => {
    window.localStorage.setItem(scoreListsLSName, JSON.stringify(lsScoreLists));
  }, [lsScoreLists]);
  /* end from react-local-storage scoreLists */

  const guessesLSName = 'practice_guesses';
  /* from react-local-storage guesses */
  const [ lsGuesses, setLsGuesses ] = useState(jsonFromLS(guessesLSName, initMap(() => [])));
  useEffect(() => {
    window.localStorage.setItem(guessesLSName, JSON.stringify(lsGuesses));
  }, [lsGuesses]);
  /* end from react-local-storage guesses */

  const finishedLSName = 'practice_finished';
  /* from react-local-storage finished */
  const [ lsFinished, setLsFinished ] = useState(jsonFromLS(finishedLSName, initMap(() => false)));
  useEffect(() => {
    window.localStorage.setItem(finishedLSName, JSON.stringify(lsFinished));
  }, [lsFinished]);
  /* end from react-local-storage finished */

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

  function getFinished() {
    return lsFinished[puzzleMode];
  }

  function setFinished(value) {
    setLsFinished(ls => {
      return {
        ...ls,
        [puzzleMode]: value
      }
    });
  }

  const yesNoButtons = (action) => {
    const handleYes = () => {
      setMessage(null);
      action();
    }
    return (
      <div className='yes-no-buttons'>
        <Button onClick={handleYes}>Yes</Button>
        <Button onClick={() => setMessage(null)}>No</Button>
      </div>
    );
  };

  const hardModeInconsistentMessage = (
    <div>
      Your guess is inconsistent with Hard Mode.  Either turn off Hard Mode in Settings or else make a different guess.
    </div>
  );

  const queryNewGameMessage = (
    <div>
      Abandon this puzzle and start a new one?
    </div>
  );

  function solvedPuzzles(sl) {
    return sl.map((scoreList, i) => {
      return scoreListIsSolved(scoreList) ? i : -1;
    }).filter(it => it >= 0);
  }

  function addGuess(guess) {
    const guesses = getGuesses();
    const scoreLists = getScoreLists();

    if (hardMode && !checkHardMode(scoreLists, guesses, guess)) {
      setMessage({
        content: hardModeInconsistentMessage
      });
    } else { 
      setGuesses([...guesses, guess]);
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

      const allSolved = solvedPuzzles(updatedScoreLists).length === targetCount;
      const guessCount = maxGuessCount(updatedScoreLists);
      const outOfGuesses = guessCount >= maxGuessCounts[puzzleMode];
      if (allSolved) {
        setFinished(true);
        setMessage({
          content: "Great work!  Puzzle is solved."
        });
      } else {
        if (outOfGuesses) {
          setFinished(true);
          setMessage({
            content: `Uh oh!  Out of guesses. Solution was ${getTargets().join(", ")}`
          });
        } else {
          setFinished(false);
        }
      }
      
    }
  }

  function newGame() {
    setMessage(null);
    setGuessInput("");
    setGuesses([]);
    setScoreLists([[]]);
    setFinished(false);
    const newTargets = listWithAdjustedLength([], targetCount, chooseRandomAnswer);
    setTargets(newTargets);
  }

  function gotoLuck() {
    const gs = getGuesses();
    setGlobalGuesses(gs);
    setGlobalTargets(getTargets());
    setPane("luck");
  }

  function queryNewGame() {
    if (getFinished()) {
      newGame();
    } else {
      setMessage({
        content: queryNewGameMessage,
        buttons: yesNoButtons(newGame)
      });
    }
  }

  if (getTargets().length === 0) {
    newGame();
  }

  return (
    <>
      {
        getGuesses().length > 0 && 
          <PracticeScores finished={getFinished()} targets={getTargets()} guesses={getGuesses()} scoreLists={getScoreLists()} solvedPuzzles={solvedPuzzles(getScoreLists())} />
      }
      {
        message && (
          <div className='practice-message-box'>
            <div className='practice-message'>
              {message.content}
            </div>
            <div className='practice-message-buttons'>
              {message.buttons}
            </div>
          </div>
        )
      }
      {
        !getFinished() && !message &&
          <div className='practice-guess'>
            <PracticeGuess guessInput={guessInput} setGuessInput={setGuessInput} allGuesses={allGuesses} addGuess={addGuess} />
          </div>
      }
      <>
        {getFinished() &&
         <div className="practice-button" >
           <Button onClick={gotoLuck}>Show Luck</Button>
         </div>
        }
        <div className="practice-button">
          <Button onClick={queryNewGame}>New Game</Button>
        </div>
      </>
    </>
  );
}
