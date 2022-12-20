import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Results from './Results';
import Select from 'react-select';

import {answerOptions} from './Data';

export default function Solve() {
    const [ target, setTarget ] = useState("");
    const [ startWith, setStartWith ] = useState([]);
    const [ showQueryButton, setShowQueryButton ] = useState(false);
    const [ showResults, setShowResults ] = useState(false);
    const [ request, setRequest ] = useState(undefined);

    const headers = ["turn", "guess", "score", "uncertainty_before_guess", "expected_uncertainty_after_guess", "compatible"] 
    const headerLabels = {
        "turn": "Turn",
        "guess": "Guess",
        "score": "Score",
        "uncertainty_before_guess": "Prior uncertainty",
        "expected_uncertainty_after_guess": "Expected post uncertainty",
        "compatible": "Compatible"
    };

    useEffect(() => {
        setShowResults(false);
        if (target && target.length > 0) {
            setRequest({
                operation: "solve",
                target,
                start_with: startWith
            });
            
            setShowQueryButton(true);
        } else {
            setShowQueryButton(false);
        }
    }, [target]);

    function callQuery() {
        setShowResults(true);
        setShowQueryButton(false);
    }

    const setTargetHandler = (a) => {
        setTarget(a.value);
    }

    return (
        <>
            <Container>
                <Row>
                    <Col>Target word</Col>
                    <Col>
                        <Select options={answerOptions} onChange={setTargetHandler} value={answerOptions.filter(option=>option.label === target)} /> 
                    </Col>
                </Row>
            </Container>
            {showQueryButton && <Button onClick={callQuery} className="query-button">Query</Button>}            
            {showResults && <Results request={request} headerLabels={headerLabels} headers={headers} />}
        </>
    )
}
