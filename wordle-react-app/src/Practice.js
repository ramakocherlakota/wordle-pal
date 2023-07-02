import React, {useState, useEffect} from 'react';
import { jsonFromLS, listOfEmptyLists, listWithAdjustedLength } from './util/Util';
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

export default function Practice({ setPane, puzzleMode, allGuesses, hardMode, targetCount, maxGuessCounts, setGlobalGuesses, setGlobalTargets, showBW }) {

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

  const okButton = (callback = () => {}) => {
    return (
      <div className='ok-button'>
        <Button onClick={() => {callback(); setMessage(null);}}>OK</Button>
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
          const single = scoreSingle(targets[i], guess);
          return [
            ...sl,
            single
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
          content: "Great work! You solved it.",
          buttons: [okButton()]
        });
      } else {
        if (outOfGuesses) {
          setFinished(true);
          setMessage({
            content: "Uh oh!  Out of guesses.",
            buttons: [okButton()]
          });
        } else {
          setFinished(false);
        }
      }
      
    }
  }

  function newGame() {
    if (!getFinished() && getTargets().length > 0) {
      setMessage({
        content: `Solution was "${getTargets().join(", ")}"`,
        buttons: [okButton(() => completeNewGame())]
      })
    } else {
      completeNewGame();
    }
  }

  function completeNewGame() {
    setGuessInput("");
    setGuesses([]);
    setFinished(false);
    const newTargets = listWithAdjustedLength([], targetCount, chooseRandomAnswer);
    setTargets(newTargets);
    const newScoreLists = listOfEmptyLists(targetCount);
    setScoreLists(newScoreLists);
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
      { getGuesses().length > 0 &&
        <PracticeScores finished={getFinished()} targets={getTargets()} guesses={getGuesses()} scoreLists={getScoreLists()} solvedPuzzles={solvedPuzzles(getScoreLists())} showBW={showBW} sequence={puzzleMode === 'Sequence'} maxGuessCount={maxGuessCounts[puzzleMode]} />
      }
      {
        message && (
          <div className='practice-message-box'>
            <div className='practice-message'>
              {message.content}
            </div>
            <div className='practice-message-buttons'>
              {message.buttons && message.buttons.map((msg, i) => {
                return <div className='practice-message-button' key={i}>{msg}</div>;
              })}
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
      { !message &&
        <div className='practice-button-box' >
          <div className="practice-button">
            <Button onClick={queryNewGame}>New Game</Button>
          </div>
          {getFinished() &&
           <div className="practice-button" >
             <Button onClick={gotoLuck}>Show Luck</Button>
           </div>
          }
        </div>
      }
    </>
  );
}
