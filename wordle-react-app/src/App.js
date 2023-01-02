import React, {useState, useEffect} from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Guess from './Guess';
import Remainder from './Remainder';
import Solve from './Solve';
import NumberInput from './NumberInput';
import { listWithAdjustedLength} from './Util';
import './App.css';

function App() {

  const [ dimensions, setDimensions ] = useState({targets: 1, guesses: 1});
  const [ guesses, setGuesses ] = useState([""]);
  const [ scoreLists, setScoreLists ] = useState([[""]]);
  const [ hardMode, setHardMode ] = useState(false)

  useEffect(() => {
    setGuesses((gs) => listWithAdjustedLength(gs, dimensions.guesses, () => ""))
    setScoreLists((sLists) => {
      const adjustedForTargetCount = listWithAdjustedLength(sLists, dimensions.targets, () => [[""]]);
      return adjustedForTargetCount.map((scoreList) => listWithAdjustedLength(scoreList, dimensions.guesses, () => [""]));
    });
  }, [dimensions]);

  function setTargetCount(targetCountUpdater) {
    if (typeof targetCountUpdater === 'function') {
      setDimensions((ds) => {
        return {
          guesses: ds.guesses,
          targets: targetCountUpdater(ds.targets)
        }
      });
    } else {
      setDimensions((ds) => {
        return {
          guesses: ds.guesses,
          targets: targetCountUpdater
        }
      });
    }
  }          

  function setGuessCount(guessCountUpdater) {
    if (typeof guessCountUpdater === 'function') {
      setDimensions((ds) => {
        return {
          targets: ds.targets,
          guesses: guessCountUpdater(ds.guesses)
        }
      });
    } else {
      setDimensions((ds) => {
        return {
          targets: ds.targets,
          guesses: guessCountUpdater
        }
      });
    }
  }          

  function targetCount() {
    return dimensions.targets;
  }

  return (
    <div className='app'>
      <div className='row header'>
        <div className='col' align='left'>
          <h2>Wordle Pal</h2>
        </div>
        <div className='col' align='right'>
          <h4><a target="_blank" href="help.html">Help?</a></h4>
        </div>
      </div>
      <div className='row target-word'>
        <div className='col' align='right'>
          Target Word Count
        </div>
        <div className='col' align='center'>
          <NumberInput value={targetCount()} setValue={setTargetCount} minValue={1} />
        </div>
        <div align='left' className='col'>
          {targetCount() === 1 && "Classic Wordle"}
          {targetCount() === 4 && "Quordle"}
        </div>
      </div>
      <Tabs className="mb-3" justify>
        <Tab eventKey="remainder" title="Remaining" >
          <Remainder guesses={guesses} setGuesses={setGuesses} setGuessCount={setGuessCount} scoreLists={scoreLists} setScoreLists={setScoreLists} hardMode={hardMode} setHardMode={setHardMode} targetCount={targetCount()} />
        </Tab>
        <Tab eventKey="guess" title="Best Guesses">
          <Guess guesses={guesses} setGuesses={setGuesses} setGuessCount={setGuessCount} scoreLists={scoreLists} setScoreLists={setScoreLists} hardMode={hardMode} setHardMode={setHardMode} targetCount={targetCount()} />
        </Tab>
        <Tab eventKey="solve" title="Solve">
          <Solve hardMode={hardMode} setHardMode={setHardMode} targetCount={targetCount()} />
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
