import { React, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function DataSelect({ options, value, setValue, inputKeyMapper }) {
  const [ inputValue, setInputValue ] = useState("");

  const input = inputValue.toLowerCase();
  const key = inputKeyMapper ? inputKeyMapper(input) : input;
  const filteredOptions = options(key).filter((option) => option.toLowerCase().startsWith(key));

  return (
    <Autocomplete
      value={value}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      options={filteredOptions}
      renderInput={(params) => <TextField {...params}/>}
    />
  );
}
