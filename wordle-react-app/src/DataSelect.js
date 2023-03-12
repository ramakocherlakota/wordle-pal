import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItem';
import './data-select.scss';

export default function DataSelect({ placeholder, options, value, setValue, showList }) {
  const [ inputValue, setInputValue ] = useState(value);
  const [ open, setOpen ] = useState(false);
  const [ filteredOptions, setFilteredOptions ] = useState([]);
  const [ textHasFocus, setTextHasFocus ] = useState(false);
  const [ listHasFocus, setListHasFocus ] = useState(false);

  useEffect(() => {
    const key = inputValue.toLowerCase();
    const keyedOptions = options(key) || [];
    const filteredOptions = keyedOptions.filter((option) => option.toLowerCase().startsWith(key));
    if (filteredOptions.length === 1) {
      setValue(filteredOptions[0]);
      setInputValue(filteredOptions[0]);
      setOpen(false);
    } else {
      setFilteredOptions(filteredOptions);
      setOpen((textHasFocus || listHasFocus) && showList(inputValue))
    }
  }, [options, inputValue, showList, textHasFocus, listHasFocus]);

  function changeInput(event) {
    setInputValue(event.currentTarget.value);
  }

  function handleClick(value) {
    return function() {
      setInputValue(value);
      setValue(value);
      setListHasFocus(false);
    }
  }

  function item(option) {
    return (
      <ListItemButton sx={{"cursor": "pointer"}} key={option} dense={true} onClick={handleClick(option)}>{option}</ListItemButton>
    );
  }

  function optionList() {
    return (
      <List onFocus={gainFocus}
            onBlur={loseFocus}
      >
        {filteredOptions.map(item)}
      </List>
    );    
  }

  function gainFocus() {
    setTextHasFocus(true);
    setListHasFocus(true);
  }

  function loseFocus() {
    setTextHasFocus(false);
    setTimeout(() => setListHasFocus(false), 500); // give it some time to handle the click event
  }

  return (
    <>
      <TextField
        sx={{width: "150px"}}
        size="small"
        margin="dense"
        placeholder={placeholder}
        onChange={changeInput}
        onFocus={gainFocus}
        onBlur={loseFocus}
        value={inputValue}
      />
      {open && optionList() }
    </>
  );
}
