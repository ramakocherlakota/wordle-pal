import React, {useState, useEffect} from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Guess from './Guess';
import Remainder from './Remainder';
import Solve from './Solve';
import NumberInput from './NumberInput';
import { listWithAdjustedLength} from './Util';

function App() {

  const [ targetCount, setTargetCount ] = useState(1);
  const [ guesses, setGuesses ] = useState([""]);
  const [ scoreLists, setScoreLists ] = useState(listWithAdjustedLength([], targetCount, () => [[""]]));
  const [ hardMode, setHardMode ] = useState(false)

  useEffect(() => {
    setScoreLists((t) => listWithAdjustedLength(t, targetCount, () => [[""]]));
  }, [targetCount]);

  return (
    <div>
      <div className='row'>
        <div className='col' align='right'>
          Target Word Count
        </div>
        <div className='col' align='center'>
          <NumberInput value={targetCount} setValue={setTargetCount} minValue={1} />
        </div>
        <div align='left' className='col'>
          {targetCount === 1 && "Classic Wordle"}
          {targetCount === 4 && "Quordle"}
        </div>
      </div>
      <Tabs className="mb-3" justify>
        <Tab eventKey="remainder" title="Remaining" >
          <Remainder guesses={guesses} setGuesses={setGuesses} scoreLists={scoreLists} setScoreLists={setScoreLists} hardMode={hardMode} setHardMode={setHardMode} targetCount={targetCount} />
        </Tab>
        <Tab eventKey="guess" title="Best Guesses">
          <Guess guesses={guesses} setGuesses={setGuesses} scoreLists={scoreLists} setScoreLists={setScoreLists} hardMode={hardMode} setHardMode={setHardMode} />
        </Tab>
        <Tab eventKey="solve" title="Solve">
          <Solve hardMode={hardMode} setHardMode={setHardMode} targetCount={targetCount} />
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
