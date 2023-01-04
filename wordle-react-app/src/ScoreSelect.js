import React from 'react';
import AsyncSelect from 'react-select/async';

import {scoreOptions} from './Data';

export default function ScoreSelect({ value, onChange, placeholder }) {
  const filterOptions = (inputValue: string) => {
    if (inputValue.length > 1) {
      const key = inputValue.toLowerCase().replace(/[^a-z]/g, "-");
      return scoreOptions.filter((i) => i.label.toLowerCase().startsWith(key));
    } else {
      return [];
    }
  }

  function loadOptions(inputValue, callback) {
    setTimeout(() => {
      callback(filterOptions(inputValue));
    }, 100);
  };

  return (
    <>
      <AsyncSelect placeholder={placeholder} defaultOptions={scoreOptions} loadOptions={loadOptions} onChange={onChange} value={filterOptions(value)} />
    </>
  );
}
