import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import './Autofill.scss';

export default function Autofill({ placeholder, value, setValue, optionFunc, initialOptions }) {
  const [ optionList, setOptionList ] = useState(initialOptions || []);

  function onInputChange(evt, val) {
    const list = optionFunc(val);
    setOptionList(list);
    if (list.length === 2) {
      setValue(list[1]);
    } else {
      setValue('');
    }
  }

  function onChange(evt, val) {
    setValue(val);
  }

  return (
      <Autocomplete
        options={optionList}
        forcePopupIcon={false}
        size="small"
        openOnFocus
        disableClearable
        value={value}
        onChange={onChange}
        onInputChange={onInputChange}
        sx={{ width: 120 }}
        renderInput={(params) => <TextField {...params} placeholder={placeholder} />}
      />
  );
}
