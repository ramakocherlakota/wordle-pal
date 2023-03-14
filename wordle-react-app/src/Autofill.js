import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function Autofill({ placeholder, value, setValue, optionFunc, initialOptions }) {
  const [ optionList, setOptionList ] = useState(initialOptions || []);

  function onInputChange(evt, val) {
    setOptionList(optionFunc(val));
  }

  function onChange(evt, val) {
    setValue(val);
  }

  return (
      <Autocomplete
        options={optionList}
        forcePopupIcon={false}
        size="small"
        disableClearable
        value={value}
        onChange={onChange}
        onInputChange={onInputChange}
        sx={{ width: 200 }}
        renderInput={(params) => <TextField {...params} placeholder={placeholder} />}
      />
  );
}
