/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react';
import Results from './Results';
import GoButton from './GoButton';
import AnswerSelect from './AnswerSelect';
import GuessSelect from './GuessSelect';
import { listOfEmptyStrings, listWithAdjustedLength, replaceInList} from './util/Util';
import './luck.scss';
import LuckOutputFormat from './LuckOutputFormat';

export default function Luck({ allGuesses, targets, setTargets, setScoreLists,
                               hardMode, targetCount, setPane, setGlobalGuesses, globalGuessCount }) {
  const [ output, setOutput ] = useState([]);
  const [ error, setError ] = useState("");
  const [ loading, setLoading ] = useState(false);
  const [ elapsedTime, setElapsedTime ] = useState(0);
  const [ guesses, setGuesses ] = useState(listOfEmptyStrings(globalGuessCount));
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
    setGuesses((g) => listWithAdjustedLength(g, globalGuessCount));
  }, [globalGuessCount, setGuesses]);

  useEffect(() => {
    function allChosen() {
      for (let i=0; i<targets.length; i++) {
        if (!targets[i] || targets[i].length === 0) {
          return false;
        }
      }

      for (let j=0; j<guesses.length; j++) {
        if (guesses[j] && guesses[j].length > 0) {
          return true;
        }
      }

      return false;
    }

    setShowResults(false);
    if (allChosen()) {
      setRequest({
        operation: "qrate_solution",
        targets: targets.filter(t => t && t.length > 0),
        guesses: guesses.filter(g => g && g.length > 0),
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
    return targets.map((target, idx) => {
      return (
        <div className='select' key={idx}>
          <AnswerSelect onChange={setTargetHandler(idx)} value={target} placeholder="Target..." />
        </div>
      );
    });
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
    return guesses.map((guess, idx) => {
      return (
        <div className='select' key={idx} >
          <GuessSelect allGuesses={allGuesses} onChange={setGuessHandler(idx)}
                       value={guess} placeholder="Guess..." /> 
        </div>
      );
    });
  }

  return (
    <>
      <div className="targets-guesses" >
        <div className="label">
          Targets
        </div>
        <div className='fields'>
          {targetSelects()}
        </div>
      </div>
      <div className="targets-guesses" >
        <div className="label">
          Guesses
        </div>
        <div className="fields">
          {guessSelects()}
        </div>
      </div>
      <GoButton showQueryButton={showQueryButton} showResults={showResults} setShowQueryButton={setShowQueryButton} setShowResults={setShowResults} loading={loading} elapsedTime={elapsedTime} />
      {showResults && <><Results allGuesses={allGuesses} request={request} headerLabels={headerLabels} headers={headers} loading={loading} setLoading={setLoading} elapsedTime={elapsedTime} setElapsedTime={setElapsedTime} output={output} setOutput={setOutput} error={error} setError={setError} outputHandler={luckOutputFormat} /></>}
    </>
  );

}

