import React from 'react';

import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import PopupDoc from './PopupDoc';
import { SettingsEmoji } from './util/Emojis.js';
import './Settings.scss';

export default function Settings({ hardMode, setHardMode, puzzleMode, setPuzzleMode , allGuesses, setAllGuesses }) {
  const onOff = (label, flag) => {
    return <div>{label}: {flag ? "on" : "off"}</div>;
  }

  const currentSettings =
    <div className='tooltip-text'>
      <div>Mode: {puzzleMode}</div>
      {onOff("Hard Mode", hardMode)}
      {onOff("All Guesses", allGuesses)}
    </div>;

  return (
    <PopupDoc label={SettingsEmoji()} tooltip={currentSettings} ok="OK" fontSize="60px">
      <FormGroup>
        <FormControl>
          <FormLabel id="mode-radio-buttons-group-label">Puzzle Mode</FormLabel>
          <RadioGroup
            row
            aria-labelledby="mode-radio-buttons-group-label"
            defaultValue="Wordle"
            value={puzzleMode}
            onChange={(e) => setPuzzleMode(e.target.value)}
            name="mode-radio-buttons-group"
          >
            <FormControlLabel value="Wordle" control={<Radio />} label="Wordle" />
            <FormControlLabel value="Quordle" control={<Radio />} label="Quordle" />
            <FormControlLabel value="Sequence" control={<Radio />} label="Sequence" />
          </RadioGroup>
        </FormControl>
        <FormControlLabel control={<Switch checked={hardMode} onChange={()=>setHardMode(!hardMode)} />} label="Hard Mode" />
        <FormControlLabel control={<Switch checked={allGuesses} onChange={()=>setAllGuesses(!allGuesses)} />} label="Allow All Guesses" />
      </FormGroup>
    </PopupDoc>
  );  
}
