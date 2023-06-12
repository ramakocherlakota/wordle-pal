import React from 'react';
import Autofill from './Autofill';

export default function WordSelect({ label, value, onChange, options, doc, placeholder }) {

  function keyedOptions(inputString) {
    const input = inputString ? inputString.toLowerCase().trim() : null;
    if (input && input.length > 0) {
      const key = input.substring(0, 1);
      if (key in options) {
        const keyedOptions = options[key];
        const filtered = keyedOptions.filter(o => o.toLowerCase().startsWith(input));
        return ["",...filtered];
      } 
    }
    return [];
  }

  if (value && ! options[value.substr(0, 1)].includes(value)) {
    onChange("");
  }

  return (
    <Autofill
      placeholder={label}
      value={value}
      setValue={onChange}
      optionFunc={keyedOptions} />
  );
}
