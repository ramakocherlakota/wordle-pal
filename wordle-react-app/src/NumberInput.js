import React from 'react';
import { ReactComponent as PlusIcon } from './plus-circle.svg';
import { ReactComponent as MinusIcon } from './dash-circle.svg';
import './number-input.scss';
import './add-delete-buttons.scss';

export default function NumberInput({ value, setValue, minValue, maxValue }) {

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
    <>
      <a href="#" className='add-delete-button' onClick={incf(-1)}><MinusIcon className="icon" /></a>
      <input className='value' value={value} onChange={validateAndSet} />
      <a href="#" className='add-delete-button' onClick={incf(1)} ><PlusIcon className="icon"/></a>
    </>
  );
}
