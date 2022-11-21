import React, {useState} from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Guess from './Guess';
import Remainder from './Remainder';
import Solve from './Solve';
import Spinner from "react-bootstrap/Spinner";

function App() {
    const [ loading, setLoading ] = useState(false);

    return (
        <div>
            {loading && <Spinner animation="border"/>}
            <Tabs className="mb-3" justify>
                <Tab eventKey="remainder" title="Remaining" >
                    <Remainder setLoading={setLoading} />
                </Tab>
                <Tab eventKey="solve" title="Solve">
                    <Solve title="Solve" setLoading={setLoading} />
                </Tab>
                <Tab eventKey="guess" title="Guess">
                    <Guess title="Guess" setLoading={setLoading} />
                </Tab>
            </Tabs>
        </div>
    );
}

export default App;
