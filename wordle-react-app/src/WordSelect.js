import React from 'react';
import Autofill from './Autofill';

export default function WordSelect({ label, value, onChange, options, doc, placeholder }) {

  function keyedOptions(input) {
    if (input && input.length > 0) {
      const key = input.substring(0, 1).toLowerCase();
      if (key in options) {
        const keyedOptions = options[key];
        const filtered = keyedOptions.filter(o => o.toLowerCase().startsWith(input.toLowerCase().trim()));
        return ["",...filtered];
      } 
    }
    return [];
  }

  return (
    <Autofill
      placeholder={label}
      value={value}
      setValue={onChange}
      optionFunc={keyedOptions} />
  );
}
