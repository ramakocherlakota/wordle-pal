import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Guess from './Guess';
import Remainder from './Remainder';
import Solve from './Solve';

function App() {

    return (
        <div>
            <Tabs className="mb-3" justify>
                <Tab eventKey="remainder" title="Remaining" >
                    <Remainder />
                </Tab>
                <Tab eventKey="guess" title="Best Guess">
                    <Guess  />
                </Tab>
                <Tab eventKey="solve" title="Solve">
                    <Solve  />
                </Tab>
            </Tabs>
        </div>
    );
}

export default App;
