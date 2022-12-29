import React from 'react';
import Button from 'react-bootstrap/Button';
import { ReactComponent as PlusIcon } from './plus-circle.svg';
import { ReactComponent as MinusIcon } from './dash-circle.svg';
import './number-input.scss';

export default function NumberInput({ value, setValue, minValue, maxValue, label }) {

  const validateAndSet = (e) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue)) {
      callSetValue(newValue);
    }
  }

  const callSetValue = (n) => {
    if ((!minValue || (n >= minValue)) &&
        (!maxValue || (n <= maxValue))) {
      setValue(n);
    }
  }

  const incf = (i) => {
    return () => callSetValue(value + i);
  }

  return (
      <div className='row'>
        <div className='col number-input-label'>
          {label}
        </div>
        <div className='col'>
          <Button className='up-down-button' onClick={incf(-1)} size="sm"><MinusIcon/></Button>
          <input class='value' value={value} onChange={validateAndSet} />
          <Button className='up-down-button' onClick={incf(1)} size="sm"><PlusIcon/></Button>
        </div>
      </div>
  );
}
