import React from 'react';
import PopupDoc from './PopupDoc';
import DataSelect from './DataSelect';

export default function WordSelect({ label, value, onChange, options, doc, placeholder }) {

  function keyedOptions(input) {
    if (input && input.length > 1) {
      const key = input.substring(0, 2).toLowerCase();
      return options[key];
    } else {
      return [];
    }
  }

  return (
     <PopupDoc doc=<div>{doc}</div> >
       <DataSelect
         placeholder={label}
         value={value}
         setValue={onChange}
         showList={(input) => input.length > 1 && input.length < 5}
         options={keyedOptions} />
     </PopupDoc>
  );
}
