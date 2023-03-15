import React from 'react';
import PopupDoc from './PopupDoc';
import Autofill from './Autofill';

export default function WordSelect({ label, value, onChange, options, doc, placeholder }) {

  function keyedOptions(input) {
    if (input && input.length > 1) {
      const key = input.substring(0, 2).toLowerCase();
      return ["",...options[key]];
    } else {
      return [];
    }
  }

  return (
     <PopupDoc doc=<div>{doc}</div> >
       <Autofill
         placeholder={label}
         value={value}
         setValue={onChange}
         optionFunc={keyedOptions} />
     </PopupDoc>
  );
}
