import React, {useState} from 'react';
import Results from './Results';
import GoButton from './GoButton';
import AnswerSelect from './AnswerSelect';
import GuessSelect from './GuessSelect';
import HardModeRow from './HardModeRow';
import AllGuessesRow from './AllGuessesRow';
import {listOfEmptyStrings, listWithAdjustedLength, replaceInList} from './Util';

export default function RateSolution(allGuesses, setAllGuesses, hardMode, setHardMode, targetCount) {
  const [ output, setOutput ] = useState([]);
  const [ error, setError ] = useState("");
  const [ loading, setLoading ] = useState(false);
  const [ elapsedTime, setElapsedTime ] = useState(0);
  const [ targets, setTargets ] = useState(listOfEmptyStrings(targetCount));
  const [ guesses, setGuesses ] = useState([""]);
  const [ showQueryButton, setShowQueryButton ] = useState(false);
  const [ showResults, setShowResults ] = useState(false);
  const [ request, setRequest ] = useState(undefined);
  const [ headers, setHeaders ] = useState([]);
  const [ headerLabels, setHeaderLabels ] = useState({});
  const [ headerDocs, setHeaderDocs ] = useState({});

  useEffect(() => {
    const newHeaders = ["guess", ...targets.map(t, i => `target_${i}`), "outcome", "best_guess", "guess_rank", "info", "buttons"]
    setHeaders(newHeaders);

    let newHeaderLabels = {"guess" : "Guess",
                           "outcome" : "Solved?",
                           "best_guess" : "Best Guess",
                           "guess_rank" : "Guess Rank",
                           "info" : "Guess Quality",
                           "buttons" : "Actions"}
    for (let i=0; i<targets.length; i++) {
      const target = targets[i]
      newHeaderLabels[`target_${i}`] = target;
    }                           
    setHeaderLabels(newHeaderLabels);

    let newHeaderDocs = {
      "best_guess" : <div>What Wordle Pal would guess in this situation</div>,
      "info" : <div>Value of this guess, on a scale of 0 - 100, based on the expected amount of information it would get back</div>,
      "guess_rank" : <div>Rank of the guess in the list, rated by Guess Quality</div>,
      "buttons" : <div>Click on an icon to navigate to the corresponding tab, prepopulated with these guesses and targets</div>
    }
    for (let i=0; i<targets.length; i++) {
      newHeaderDocs[`target_${i}`] = <div>Score of the guess for this target word, plus the number of remaining possible answers.</div>
    }                           
    setHeaderDocs(newHeaderDocs);
  }, [targets]);

  useEffect(() => {
    setTargets((t) => listWithAdjustedLength(t, targetCount));
  }, [targetCount]);

  useEffect(() => {
    function allChosen() {
      for (let i=0; i<targets.length; i++) {
        if (!targets[i] || targets[i].length === 0) {
          return false;
        }
      }

      for (let j=0; j<guesses.length; j++) {
        if (!guesses[j] || guesses[j].length === 0) {
          return false;
        }
      }

      return true;
    }

    setShowResults(false);
    if (allChosen()) {
      setRequest({
        operation: "qrate_solution",
        targets,
        guesses,
        hard_mode: hardMode,
        count: 1
      });
      
      setShowQueryButton(true);
    } else {
      setShowQueryButton(false);
    }
  }, [targets, hardMode, allGuesses]);

  function setTarget(i, newval) {
    setTargets((ts) => replaceInList(ts, newval, i));
  }

  function setTargetHandler(i) {
    return function(a) {
      setTarget(i, a && a.value);
    }
  }

  function targetSelects() {
    return targets.map((target, idx) => {
      return (
        <div className='row' key={idx} >
          <div className='col target' >
            <AnswerSelect onChange={setTargetHandler(idx)} value={target} placeholder="Target word..." /> 
          </div>
          <div className='col' />
        </div>
      );
    });
  }

  function setGuess(i, newval) {
    setGuesses((ts) => replaceInList(ts, newval, i));
  }

  function setGuessHandler(i) {
    return function(a) {
      setGuess(i, a && a.value);
    }
  }

  function guessSelects() {
    return guesses.map((guess, idx) => {
      return (
        <div className='row' key={idx} >
          <div className='col guess' >
            <GuessSelect allGuesses={allGuesses} onChange={setGuessHandler(idx)} value={guess} placeholder="Guess word..." /> 
          </div>
          <div className='col' />
        </div>
      );
    });
  }
}
