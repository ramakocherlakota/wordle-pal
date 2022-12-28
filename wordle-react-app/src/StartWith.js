import React from 'react';
import Button from 'react-bootstrap/Button';
import { ReactComponent as TrashIcon } from './trash.svg';
import { ReactComponent as PlusIcon } from './plus-circle.svg';
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
        <>
          {startWith.map((sw, index) => 
            <div className="row" key={index}>
              <div className="col">
                <Select  options={answerOptions} onChange={setStartWithAt(index)} value={answerOptions.filter(option => option.label === sw)} />
              </div>
              <div className='col'>
                <div className='row'>
                  <div className='col'>
                    {startWith.length > 0 &&
                     <Button onClick={deleteRow(index)} size="sm"><TrashIcon/></Button>
                    }
                  </div>
                  {index === startWith.length - 1 &&
                   <div className='col'><Button onClick={addRow} size="sm"><PlusIcon/></Button></div>
                  }
                </div>
              </div>
            </div>
          )}
        </>
    );
}
