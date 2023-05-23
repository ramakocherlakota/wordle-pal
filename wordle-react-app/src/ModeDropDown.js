import React  from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function ModeDropDown({puzzleMode, setPuzzleMode}) {
  function onChange(event) {
    setPuzzleMode(event.target.value);
  }

  return (
    <Select size="small" value={puzzleMode} onChange={onChange}>
      <MenuItem value="Wordle">Wordle</MenuItem>
      <MenuItem value="Quordle">Quordle</MenuItem>
      <MenuItem value="Sequence">Sequence</MenuItem>
    </Select>
  );
}
