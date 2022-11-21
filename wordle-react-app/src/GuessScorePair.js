import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';

import {answerOptions, scoreOptions} from './Data';

export default function GuessScorePair({score, guess, setScore, setGuess, deleter}) {
    const setScoreHandler = (s) => {
        console.log(s)
        setScore(s);
    }

    const setGuessHandler = (a) => {
        console.log(a);
        setGuess(a);
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
                
            </Col>
        </Row>);
}
