/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react';
import Results from './Results';
import GoButton from './GoButton';
import AnswerSelect from './AnswerSelect';
import {listWithAdjustedLength, replaceInList} from './util/Util';
import './solve.scss';

export default function Solve({allGuesses, hardMode, targetCount, targets, setTargets, guesses, setGuesses, sequence}) {
  const [ output, setOutput ] = useState([]);
  const [ error, setError ] = useState("");
  const [ loading, setLoading ] = useState(false);
  const [ elapsedTime, setElapsedTime ] = useState(0);
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
  }, [targetCount, setTargets]);

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
        operation: "solve",
        targets,
        hard_mode: hardMode,
        sequence: sequence,
        start_with: guesses.filter(x => x.length > 0)
      });
      
      setShowQueryButton(true);
    } else {
      setShowQueryButton(false);
    }
  }, [targets, guesses, hardMode, allGuesses, sequence]);

  function setTarget(i, newval) {
    setTargets((ts) => replaceInList(ts, newval, i));
  }

  function setTargetHandler(i) {
    return function(a) {
      setTarget(i, a);
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
      <div className='col target-block'>
        {filling}
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
      <GoButton showQueryButton={showQueryButton} showResults={showResults} setShowQueryButton={setShowQueryButton} setShowResults={setShowResults} loading={loading} elapsedTime={elapsedTime} />
      {showResults && <><Results allGuesses={allGuesses} request={request} headerLabels={headerLabels} headerDocs={headerDocs} headers={headers} loading={loading} setLoading={setLoading} elapsedTime={elapsedTime} setElapsedTime={setElapsedTime} output={output} setOutput={setOutput} error={error} setError={setError} /></>}
    </>
  )
}
