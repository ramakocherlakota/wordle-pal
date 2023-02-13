import React, {useState, useEffect} from 'react';
import { ReactComponent as TrashIcon } from './trash.svg';
import { ReactComponent as PlusIcon } from './plus-circle.svg';
import Results from './Results';
import GoButton from './GoButton';
import AnswerSelect from './AnswerSelect';
import GuessSelect from './GuessSelect';
import HardModeRow from './HardModeRow';
import AllGuessesRow from './AllGuessesRow';
import {addAt, deleteAt, listOfEmptyStrings, listWithAdjustedLength, replaceInList} from './Util';
import './rate-solution.scss';
import LuckOutputFormat from './LuckOutputFormat';

export default function Luck({ allGuesses, setAllGuesses, 
                                       hardMode, setHardMode, targetCount }) {
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
  const luckOutputFormat = (data) => <LuckOutputFormat {...data} />;

  useEffect(() => {
    const newHeaders = ["guess", ...targets.map((t, i) => `target_${i}`), "outcome", "best_guess", "guess_rank", "info", "buttons"]
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
      newHeaderDocs[`target_${i}`] = <div>Score of the guess for this target word, together with the number of remaining possible answers consistent with what is known so far about this target..</div>
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
  }, [guesses, targets, hardMode, allGuesses]);

  function setTarget(i, newval) {
    setTargets((ts) => replaceInList(ts, newval, i));
  }

  function setTargetHandler(i) {
    return function(a) {
      setTarget(i, a && a.value);
    }
  }

  function targetSelects() {
    const filling = targets.map((target, idx) => {
      return (
        <div className='row' key={idx} >
          <div className='col'>
            <AnswerSelect onChange={setTargetHandler(idx)} value={target} placeholder="Target..." />
          </div>
        </div>
      );
    });
    return (
      <div className='col target'>
        {filling}
      </div>
    );
  }

  function setGuess(i, newval) {
    setGuesses((ts) => replaceInList(ts, newval, i));
  }

  function setGuessHandler(i) {
    return function(a) {
      setGuess(i, a && a.value);
    }
  }

  function deleteGuess(index) {
    return function() {
      setGuesses((gs) => deleteAt(gs, index));
    }
  }

  function addGuess(index) {
    return function() {
      setGuesses((gs) => addAt(gs, index, ""));
    }
  }

  function guessSelects() {
    const filling = guesses.map((guess, idx) => {
      return (
        <div className='row' key={idx} >
          <div className='col'>
            <GuessSelect allGuesses={allGuesses} onChange={setGuessHandler(idx)}
                         value={guess} placeholder="Guess..." /> 
          </div>
          <div className='col'>
            <a href="/#" className="add-delete-button" onClick={deleteGuess(idx)} ><TrashIcon className="icon" /></a>
            <a href="/#" className="add-delete-button" onClick={addGuess(idx)} ><PlusIcon className="icon"/></a>
          </div>
        </div>
      );
    });
    return (
      <>
        <div className='col guess'>
          {filling}
          <div className='row' key='-1'>
            <div className='col'>
              <a href="/#" className="add-delete-button" onClick={addGuess(guesses.length)} ><PlusIcon className="icon"/></a>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="row" >
        <div className="col targets">
          Target Word{targetCount > 1 ? "s" : ""}
        </div>
        <div className="col">
          {targetSelects()}
        </div>
      </div>
      <div className="row" >
        <div className="col guesses">
          Guesses
        </div>
        <div className="col">
          {guessSelects()}
        </div>
      </div>
      <HardModeRow hardMode={hardMode} setHardMode={setHardMode}  />
      <AllGuessesRow allGuesses={allGuesses} setAllGuesses={setAllGuesses} />
      <GoButton showQueryButton={showQueryButton} showResults={showResults} setShowQueryButton={setShowQueryButton} setShowResults={setShowResults} loading={loading} elapsedTime={elapsedTime} />
      {showResults && <><Results allGuesses={allGuesses} request={request} headerLabels={headerLabels} headerDocs={headerDocs} headers={headers} loading={loading} setLoading={setLoading} elapsedTime={elapsedTime} setElapsedTime={setElapsedTime} output={output} setOutput={setOutput} error={error} setError={setError} outputHandler={luckOutputFormat} /></>}
    </>
  );

}

