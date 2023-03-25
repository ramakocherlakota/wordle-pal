/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react';
import Results from './Results';
import GoButton from './GoButton';
import AnswerSelect from './AnswerSelect';
import GuessSelect from './GuessSelect';
import { listWithAdjustedLength, replaceInList} from './util/Util';
import './luck.scss';
import LuckOutputFormat from './LuckOutputFormat';

export default function Luck({ allGuesses, targets, setTargets, setScoreLists,
                               hardMode, targetCount, setPane, setGlobalGuesses }) {
  const [ output, setOutput ] = useState([]);
  const [ error, setError ] = useState("");
  const [ loading, setLoading ] = useState(false);
  const [ elapsedTime, setElapsedTime ] = useState(0);
  const [ guesses, setGuesses ] = useState([""]);
  const [ showQueryButton, setShowQueryButton ] = useState(false);
  const [ showResults, setShowResults ] = useState(false);
  const [ request, setRequest ] = useState(undefined);
  const [ headers, setHeaders ] = useState([]);
  const [ headerLabels, setHeaderLabels ] = useState({});
  const luckOutputFormat = (data) => <LuckOutputFormat {...data} setPane={setPane} setScoreLists={setScoreLists} setGlobalGuesses={setGlobalGuesses}  />;

  useEffect(() => {
    const newHeaders = ["guess", ...targets.map((t, i) => `target_${i}`)];
    setHeaders(newHeaders);

    const targetLabels = targets.reduce((a, v, i) => ({ ...a, [`target_${i}`]: v}), {})
    const headerLabels = {"guess" : "",
                          "total" : "Total",
                          "links" : "Links",
                          ...targetLabels};
                           
    setHeaderLabels(headerLabels);
  }, [targets]);

  useEffect(() => {
    setTargets((t) => listWithAdjustedLength(t, targetCount));
  }, [targetCount, setTargets]);

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
      setGuess(i, a);
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
        </div>
      );
    });
    return (
      <>
        <div className='col guess'>
          {filling}
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
      <div className="row guess-block" >
        <div className="col guesses">
          Guesses
        </div>
        <div className="col">
          {guessSelects()}
        </div>
      </div>
      <GoButton showQueryButton={showQueryButton} showResults={showResults} setShowQueryButton={setShowQueryButton} setShowResults={setShowResults} loading={loading} elapsedTime={elapsedTime} />
      {showResults && <><Results allGuesses={allGuesses} request={request} headerLabels={headerLabels} headers={headers} loading={loading} setLoading={setLoading} elapsedTime={elapsedTime} setElapsedTime={setElapsedTime} output={output} setOutput={setOutput} error={error} setError={setError} outputHandler={luckOutputFormat} /></>}
    </>
  );

}

