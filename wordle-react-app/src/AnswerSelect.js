import React from 'react';
import AsyncSelect from 'react-select/async';

import {answerOptions} from './Data';

export default function AnswerSelect({ value, onChange, placeholder }) {
  const filterOptions = (inputValue: string) => {
    if (inputValue.length > 1) {
      const key = inputValue.substring(0, 2).toLowerCase();;
      if (key in answerOptions) {
        return answerOptions[key].filter((i) =>
          i.label.toLowerCase().startsWith(inputValue.toLowerCase())
        );
      }
    } 
    return [];
  }

  function loadOptions(inputValue, callback) {
    setTimeout(() => {
      callback(filterOptions(inputValue));
    }, 100);
  };

  return (
    <AsyncSelect cacheOptions defaultOptions placeholder={placeholder} loadOptions={loadOptions} onChange={onChange} value={filterOptions(value)} />
  );
}
