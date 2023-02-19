import React, {useState, useEffect} from 'react';
import Results from './Results';
import StartWith from './StartWith';
import GoButton from './GoButton';
import AnswerSelect from './AnswerSelect';
import HardModeRow from './HardModeRow';
import AllGuessesRow from './AllGuessesRow';
import {addAt, deleteAt, listOfEmptyStrings, listWithAdjustedLength, replaceInList} from './Util';
import './solve.scss';
import { ReactComponent as TrashIcon } from './trash.svg';
import { ReactComponent as PlusIcon } from './plus-circle.svg';

export default function Solve({allGuesses, setAllGuesses, hardMode, setHardMode, targetCount, setTargetCount, targets, setTargets}) {
  const [ output, setOutput ] = useState([]);
  const [ error, setError ] = useState("");
  const [ loading, setLoading ] = useState(false);
  const [ elapsedTime, setElapsedTime ] = useState(0);
  const [ startWith, setStartWith ] = useState([""]);
  const [ showQueryButton, setShowQueryButton ] = useState(false);
  const [ showResults, setShowResults ] = useState(false);
  const [ request, setRequest ] = useState(undefined);

  const headers = ["turn", "guess", "uncertainty_before_guess", "expected_uncertainty_after_guess", "compatible"] 
  const headerLabels = {
    "turn": "Turn",
    "guess": "Guess",
    "uncertainty_before_guess": "Prior Uncertainty",
    "expected_uncertainty_after_guess": "Expected Uncertainty",
    "compatible": "Hard Mode Compatible"
  };
  const headerDocs = {
    uncertainty_before_guess: <div>Uncertainty (in bits) about the solution prior to this guess being made</div>,
    expected_uncertainty_after_guess: <div>Expected value of the uncertainty after this guess is made and a score is returned.  Lower values indicate less uncertainty and are better!</div>
  };

  useEffect(() => {
    setTargets((t) => listWithAdjustedLength(t, targetCount));
  }, [targetCount]);

  useEffect(() => {
    function allTargetsChosen() {
      for (let i=0; i<targets.length; i++) {
        if (!targets[i] || targets[i].length === 0) {
          return false;
        }
      }
      return true;
    }

    setShowResults(false);
    if (allTargetsChosen()) {
      setRequest({
        operation: "qsolve",
        targets,
        hard_mode: hardMode,
        start_with: startWith.filter(x => x.length > 0)
      });
      
      setShowQueryButton(true);
    } else {
      setShowQueryButton(false);
    }
  }, [targets, startWith, hardMode, allGuesses]);

  function deleteTarget(index) {
    return function() {
      setTargets((gs) => deleteAt(gs, index));
      setTargetCount(t => t - 1);
    }
  }

  function addTarget(index) {
    return function() {
      setTargets((gs) => addAt(gs, index, ""));
      setTargetCount(t => t + 1);
    }
  }

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
          <div className='col'>
            <a className="add-delete-button" onClick={deleteTarget(idx)} ><TrashIcon className="icon" /></a>
            <a className="add-delete-button" onClick={addTarget(idx)} ><PlusIcon className="icon"/></a>
          </div>
        </div>
      );
    });
    return (
      <div className='col target-block'>
        {filling}
        <div className='row' key='-1'>
          <div className='col'>
            <a className="add-delete-button" onClick={addTarget(targetCount)} ><PlusIcon className="icon"/></a>
          </div>
        </div>
      </div>
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
      <div className="row start-with" >
        <div className="col start-with-label">
          Start With
        </div>
        <div className="col">
          <StartWith allGuesses={allGuesses} startWith={startWith} setStartWith={setStartWith} />
        </div>
      </div>
      <HardModeRow hardMode={hardMode} setHardMode={setHardMode}  />
      <AllGuessesRow allGuesses={allGuesses} setAllGuesses={setAllGuesses} />
      <GoButton showQueryButton={showQueryButton} showResults={showResults} setShowQueryButton={setShowQueryButton} setShowResults={setShowResults} loading={loading} elapsedTime={elapsedTime} />
      {showResults && <><Results allGuesses={allGuesses} request={request} headerLabels={headerLabels} headerDocs={headerDocs} headers={headers} loading={loading} setLoading={setLoading} elapsedTime={elapsedTime} setElapsedTime={setElapsedTime} output={output} setOutput={setOutput} error={error} setError={setError} /></>}
    </>
  )
}
