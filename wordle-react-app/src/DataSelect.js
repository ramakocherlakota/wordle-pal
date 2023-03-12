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
    setFilteredOptions(options(key).filter((option) => option.toLowerCase().startsWith(key)));
    setOpen((textHasFocus || listHasFocus) && showList(inputValue))
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
      <ListItemButton dense={true} onClick={handleClick(option)}>{option}</ListItemButton>
    );
  }

  function optionList() {
    return (
      <List onFocus={() => setListHasFocus(true)}>
        {filteredOptions.map(item)}
      </List>
    );    
  }

  function gainFocus() {
    setTextHasFocus(true);
    setListHasFocus(true);
  }

  return (
    <>
      <TextField
        size="small"
        margin="dense"
        placeholder={placeholder}
        onChange={changeInput}
        onFocus={gainFocus}
        onBlur={() => setTextHasFocus(false)}
        value={inputValue}
      />
      {open && optionList() }
    </>
  );
}
