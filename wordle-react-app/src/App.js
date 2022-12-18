import React, {useState} from 'react';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Guess from './Guess';
import Results from './Results';
import Remainder from './Remainder';
import Solve from './Solve';

function App() {
    const [ showQueryButton, setShowQueryButton ] = useState(false);
    const [ showResults, setShowResults ] = useState(false);
    const [ request, setRequest ] = useState(undefined);

    const hideResults = () => setShowResults(false);
    const unhideResults = () => setShowResults(true);

    return (
        <div>
            <Tabs className="mb-3" justify>
                <Tab eventKey="remainder" title="Remaining" >
                    <Remainder setRequest={setRequest} setShowQueryButton={setShowQueryButton} hideResults={hideResults}  />
                </Tab>
                <Tab eventKey="guess" title="Best Guess">
                    <Guess  />
                </Tab>
                <Tab eventKey="solve" title="Solve">
                    <Solve  />
                </Tab>
            </Tabs>
            {showQueryButton && <Button onClick={unhideResults} className="query-button">Query</Button>}
            {showResults && <Results request={request}  />}
        </div>
    );
}

export default App;
