import React, {useState, useEffect} from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Guess from './Guess';
import Remainder from './Remainder';
import Solve from './Solve';
import {callService} from './Services';
import ClipLoader from "react-spinners/ClipLoader";

function App() {
    const [ loading, setLoading ] = useState(false);
    const [ answers, setAnswers ] = useState([]);
    const [ scores, setScores ] = useState([]);

    useEffect(() => {
        callService('list_scores', setLoading).then(console.log);
    }, []);

//    useEffect(() => {
//        callService('list_answers', setLoading, setAnswers);
//    }, []);

              
    return (
        <div>
            <ClipLoader
                loading={loading}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
            <Tabs className="mb-3" justify>
                <Tab eventKey="remainder" title="Remaining" >
                    <Remainder answers={answers} scores={scores} setLoading={setLoading} />
                </Tab>
                <Tab eventKey="solve" title="Solve">
                    <Solve answers={answers} scores={scores} title="Solve" setLoading={setLoading} />
                </Tab>
                <Tab eventKey="guess" title="Guess">
                    <Guess answers={answers} scores={scores} title="Guess" setLoading={setLoading} />
                </Tab>
            </Tabs>
        </div>
    );
}

export default App;
