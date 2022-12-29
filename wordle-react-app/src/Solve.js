import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Results from './Results';
import StartWith from './StartWith';
import Select from 'react-select';
import HardModeRow from './HardModeRow';
import {listOfEmptyStrings, extendListWithEmptyStrings} from './Util';
import './solve.scss';

import {answerOptions} from './Data';

export default function Solve({hardMode, setHardMode, targetCount}) {
  const [ targets, setTargets ] = useState(listOfEmptyStrings(targetCount));
  const [ startWith, setStartWith ] = useState(["raise"]);
  const [ showQueryButton, setShowQueryButton ] = useState(false);
  const [ showResults, setShowResults ] = useState(false);
  const [ request, setRequest ] = useState(undefined);

  const headers = ["turn", "guess", "score", "uncertainty_before_guess", "expected_uncertainty_after_guess", "compatible"] 
  const headerLabels = {
    "turn": "Turn",
    "guess": "Guess",
    "score": "Score",
    "uncertainty_before_guess": "H-Prior",
    "expected_uncertainty_after_guess": "Expected H-post",
    "compatible": "Compatible?"
  };

  function allTargetsChosen() {
    for (let i=0; i<targetCount; i++) {
      if (targets[i].length === 0) {
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    if (targetCount > targets.length) {
      setTargets(extendListWithEmptyStrings(targets, targetCount - targets.length));
    } else {
      setTargets(targets.slice(0, targetCount));
    }
  }, [targetCount]);

  useEffect(() => {
    setShowResults(false);
    if (allTargetsChosen()) {
      setRequest({
        operation: "qsolve",
        targets,
        hard_mode: hardMode,
        start_with: startWith
      });
      
      setShowQueryButton(true);
    } else {
      setShowQueryButton(false);
    }
  }, [targets, startWith, hardMode]);

  function callQuery() {
    setShowResults(true);
    setShowQueryButton(false);
  }

  function setTarget(i, newval) {
    setTargets(targets.map((t, idx) => {
      if (idx === i) {
        return newval;
      } else {
        return t;
      }
    }));
  }

  function setTargetHandler(i) {
    return function(a) {
      setTarget(i, a.value);
    }
  }

  function targetSelects() {
    return targets.map((target, idx) => {
      return (
        <div className='row'>
          <div className='col'>
            <Select options={answerOptions} onChange={setTargetHandler(idx)} value={answerOptions.filter(option=> option.value === target)} /> 
          </div>
        </div>
      );
    });
  }

  return (
    <>
      <div className="row" >
        <div className="col">
          Target Words
        </div>
        <div className="col">
          {targetSelects()}
        </div>
      </div>
      <div className="row start-with" >
        <div className="col">
          Start With
        </div>
        <div className="col">
          <StartWith startWith={startWith} setStartWith={setStartWith} />
        </div>
      </div>
      <HardModeRow hardMode={hardMode} setHardMode={setHardMode} />
      <hr/>
      {showQueryButton && <Button onClick={callQuery} >Go!</Button>}
      {showResults && <><Results request={request} headerLabels={headerLabels} headers={headers} /></>}
    </>
  )
}
