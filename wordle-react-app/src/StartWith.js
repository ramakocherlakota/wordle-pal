import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';

import {answerOptions} from './Data';

export default function StartWith({startWith, setStartWith}) {
    function deleteRow(index) {
        return function() {
            const newStartWith = startWith.filter((sw, idx) => {
                return idx !== index;
            });
            setStartWith(newStartWith);
        }
    }

    function setStartWithAt(index) {
        return function(opt) {
            const newStartWith = startWith.map((sw, idx) => {
                if (idx !== index) {
                    return startWith[idx];
                } else {
                    return opt.value;
                }
            });
            setStartWith(newStartWith);
        }
    }

    function addRow() {
      setStartWith([...startWith, ""]);
    }

    return (
        <Container>
          {startWith.map((sw, index) => 
                <Row>
                  <Col>
                    <Select key={index} options={answerOptions} onChange={setStartWithAt(index)} value={answerOptions.filter(option => option.label === sw)} />
                  </Col>
                  <Col>
                    <Button onClick={deleteRow(index)} size="sm">X</Button>
                    </Col>
                </Row>
          )}
          <Row>
            <Col>
              <Button onClick={addRow}>Add</Button>
            </Col>
          </Row>
        </Container>
    );
}
