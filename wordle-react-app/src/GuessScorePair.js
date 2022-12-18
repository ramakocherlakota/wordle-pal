import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';

import {answerOptions, scoreOptions} from './Data';

export default function GuessScorePair({score, guess, setScore, setGuess, deleter}) {
    const setScoreHandler = (s) => {
        setScore(s.value);
    }

    const setGuessHandler = (a) => {
        setGuess(a.value);
    }

    return (
        <Row>
            <Col>
                <Select options={answerOptions} onChange={setGuessHandler} /> 
            </Col>
            <Col>
                <Select options={scoreOptions} onChange={setScoreHandler} />
            </Col>
            <Col>
                {guess && score && <>{guess} = {score}</>}
            </Col>
            <Col>
                <Button onClick={deleter} size="sm">X</Button>
            </Col>
        </Row>);
}
