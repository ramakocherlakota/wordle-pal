import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import './Autofill.scss';

export default function Autofill({ placeholder, value, setValue, optionFunc, initialOptions }) {
  const [ optionList, setOptionList ] = useState(initialOptions || []);
  const [ inputValue, setInputValue ] = useState(value || '');

  useEffect(() => {
    setOptionList(optionFunc(inputValue));
  }, [inputValue, optionFunc]);

  function onInputChange(evt, val) {
    setInputValue(val);
  }

  function onBlur() {
    const filteredOptions = optionList.filter(o => o.toLowerCase().startsWith(inputValue.toLowerCase().trim()));
    if (filteredOptions.length === 1) {  
      setValue(filteredOptions[0]);
      setInputValue(filteredOptions[0]);
    } else {
      setValue('');
      setInputValue('');
    }
  }

  function onChange(evt, val) {
    setValue(val);
  }

  function isOptionEqualToValue(option, value) {
    return option === value.toLowerCase().trim();
  }

  return (
      <Autocomplete
        options={optionList}
        forcePopupIcon={false}
        size="small"
        openOnFocus
        disableClearable
        isOptionEqualToValue={isOptionEqualToValue}
        onBlur={onBlur}
        inputValue={inputValue}
        value={value || null}
        onChange={onChange}
        onInputChange={onInputChange}
        sx={{ width: 120 }}
        renderInput={(params) => <TextField {...params} placeholder={placeholder} />}
      />
  );
}
