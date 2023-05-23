import React from 'react';

import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import PopupDoc from './PopupDoc';
import { SettingsEmoji } from './util/Emojis.js';
import './Settings.scss';

export default function Settings({ hardMode, setHardMode, allGuesses, setAllGuesses }) {
  const onOff = (label, flag) => {
    return <div>{label}: {flag ? "on" : "off"}</div>;
  }

  const reset = () => {
    window.localStorage.clear();
    window.location.reload();
  }

  const currentSettings =
    <div className='tooltip-text'>
      {onOff("Hard Mode", hardMode)}
      {onOff("All Guesses", allGuesses)}
    </div>;

  return (
    <PopupDoc label={SettingsEmoji()} tooltip={currentSettings} ok="OK" fontSize="60px">
      <FormGroup>
        <FormControlLabel control={<Switch checked={hardMode} onChange={()=>setHardMode(!hardMode)} />} label="Hard Mode" />
        <FormControlLabel control={<Switch checked={allGuesses} onChange={()=>setAllGuesses(!allGuesses)} />} label="Allow All Guesses" />
      </FormGroup>
      <div className="reset-button">
        <Button onClick={reset} variant='outlined'>Reset All</Button>
      </div>
    </PopupDoc>
  );  
}
