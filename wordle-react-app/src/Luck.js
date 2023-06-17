import React, {useState, useEffect} from 'react';
import Results from './Results';
import GoButton from './GoButton';
import QueryTargetGuess from './QueryTargetGuess';
import LuckOutputFormat from './LuckOutputFormat';

export default function Luck({ allGuesses, targets, setTargets, setScoreLists,
                               luckGuesses, setLuckGuesses,
                               hardMode, targetCount, setPane, setGlobalGuesses, globalGuessCount, sequence }) {
  const [ output, setOutput ] = useState([]);
  const [ error, setError ] = useState("");
  const [ loading, setLoading ] = useState(false);
  const [ elapsedTime, setElapsedTime ] = useState(0);
  const [ showQueryButton, setShowQueryButton ] = useState(false);
  const [ request, setRequest ] = useState(undefined);
  const [ headers, setHeaders ] = useState([]);
  const [ headerLabels, setHeaderLabels ] = useState({});
  const luckOutputFormat = (data) => <LuckOutputFormat {...data} setPane={setPane} setScoreLists={setScoreLists} setGlobalGuesses={setGlobalGuesses} globalGuessCount={globalGuessCount} targetCount={targetCount} />;
  const [ showResults, setShowResults ] = useState(false);

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
    function allChosen() {
      for (let i=0; i<targets.length; i++) {
        if (!targets[i] || targets[i].length === 0) {
          return false;
        }
      }

      for (let j=0; j<luckGuesses.length; j++) {
        if (luckGuesses[j] && luckGuesses[j].length > 0) {
          return true;
        }
      }

      return false;
    }

    setShowResults(false);
    if (allChosen()) {
      setRequest({
        operation: "rate_solution",
        targets: targets.filter(t => t && t.length > 0),
        guesses: luckGuesses.filter(g => g && g.length > 0),
        sequence: sequence,
        hard_mode: hardMode,
        count: 1
      });
      
      setShowQueryButton(true);
    } else {
      setShowQueryButton(false);
    }
  }, [luckGuesses, targets, hardMode, allGuesses, sequence]);


  return (
    <>
      <p>
        Enter the target word(s) and your guesses to see how lucky you were.
      </p>
      <QueryTargetGuess allGuesses={allGuesses} targets={targets} setTargets={setTargets} targetCount={targetCount} guessCount={globalGuessCount} guesses={luckGuesses} setGuesses={setLuckGuesses} />
      <GoButton showQueryButton={showQueryButton} showResults={showResults} setShowQueryButton={setShowQueryButton} setShowResults={setShowResults} loading={loading} elapsedTime={elapsedTime} />
      {showResults && <><Results allGuesses={allGuesses} request={request} headerLabels={headerLabels} headers={headers} loading={loading} setLoading={setLoading} elapsedTime={elapsedTime} setElapsedTime={setElapsedTime} output={output} setOutput={setOutput} error={error} setError={setError} handleOutput={luckOutputFormat} /></>}
    </>
  );

}

