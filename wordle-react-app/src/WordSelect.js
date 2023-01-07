import React, {useState, useEffect} from 'react';
import AsyncSelect from 'react-select/async';
import PopupDoc from './PopupDoc';

export default function WordSelect({ value, onChange, options, doc, placeholder }) {
  const [ filterOptions, setFilterOptions ] = useState(() => () => {});
  const [ loadOptions, setLoadOptions ] = useState(() => () => {});

  useEffect(() => {
    const newFilterOptions = (inputValue) => {
      if (inputValue && inputValue.length > 1) {
        const key = inputValue.substring(0, 2).toLowerCase();;
        if (key in options) {
          return options[key].filter((i) =>
            i.label.toLowerCase().startsWith(inputValue.toLowerCase())
          );
        }
      } 
      return [];
    };

    const newLoadOptions = (inputValue, callback) => {
      setTimeout(() => {
        callback && callback(newFilterOptions(inputValue));
      }, 100);
    }

    setFilterOptions(() => newFilterOptions);
    setLoadOptions(() => newLoadOptions);
  }, [options]); // options can change if the user checks the Allow All Guesses box

  return (
     <PopupDoc doc=<div>{doc}</div> >
       <AsyncSelect defaultOptions placeholder={placeholder} loadOptions={loadOptions} onChange={onChange} value={filterOptions(value)} />
     </PopupDoc>
  );
}
