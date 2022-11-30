import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function GuessScorePairAdder({adder}) {
    return (
        <Row>
            <Col/>
            <Col>
                <Button onClick={adder}>Add</Button>
            </Col>
            <Col/>
        </Row>
    );
}
