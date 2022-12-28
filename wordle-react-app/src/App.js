import React, {useState} from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Guess from './Guess';
import Remainder from './Remainder';
import Solve from './Solve';

function App() {

    const [ guessScores, setGuessScores ] = useState([{guess:"", score:""}])
    const [ hardMode, setHardMode ] = useState(false)

    return (
        <div>
            <Tabs className="mb-3" justify>
                <Tab eventKey="remainder" title="Remaining" >
                    <Remainder guessScores={guessScores} setGuessScores={setGuessScores} hardMode={hardMode} setHardMode={setHardMode} />
                </Tab>
                <Tab eventKey="guess" title="Best Guesses">
                    <Guess guessScores={guessScores} setGuessScores={setGuessScores} hardMode={hardMode} setHardMode={setHardMode} />
                </Tab>
                <Tab eventKey="solve" title="Solve">
                    <Solve hardMode={hardMode} setHardMode={setHardMode} />
                </Tab>
            </Tabs>
        </div>
    );
}

export default App;
