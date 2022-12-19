import React, {useState} from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Guess from './Guess';
import Remainder from './Remainder';
import Solve from './Solve';

function App() {

    const [ guessScores, setGuessScores ] = useState([{guess:"", score:""}])

    return (
        <div>
            <Tabs className="mb-3" justify>
                <Tab eventKey="remainder" title="Remaining" >
                    <Remainder guessScores={guessScores} setGuessScores={setGuessScores} />
                </Tab>
                <Tab eventKey="guess" title="Best Guess">
                    <Guess guessScores={guessScores} setGuessScores={setGuessScores}  />
                </Tab>
                <Tab eventKey="solve" title="Solve">
                    <Solve  />
                </Tab>
            </Tabs>
        </div>
    );
}

export default App;
