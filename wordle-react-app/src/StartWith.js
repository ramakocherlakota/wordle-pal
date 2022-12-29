import React from 'react';
import Button from 'react-bootstrap/Button';
import { ReactComponent as TrashIcon } from './trash.svg';
import { ReactComponent as PlusIcon } from './plus-circle.svg';
import Select from 'react-select';
import './start-with.scss';

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
          {startWith.length === 0 && 
           <Button className="add-delete-button" onClick={addRow} size="sm"><PlusIcon/></Button>}           
          {startWith.map((sw, index) => 
            <div className="row" key={index}>
              <div className="col">
                <Select  options={answerOptions} onChange={setStartWithAt(index)} value={answerOptions.filter(option => option.label === sw)} />
              </div>
              <div className='col'>
                 <Button className="add-delete-button" onClick={deleteRow(index)} size="sm"><TrashIcon/></Button>
                {index === startWith.length - 1 &&
                 <Button className="add-delete-button" onClick={addRow} size="sm"><PlusIcon/></Button>
                }
              </div>
            </div>
          )}
        </>
    );
}
