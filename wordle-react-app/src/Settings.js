import React from 'react';

import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import PopupDoc from './PopupDoc';
import { SettingsEmoji } from './util/Emojis.js';

export default function Settings({ hardMode, setHardMode, showBW, setShowBW, allGuesses, setAllGuesses }) {
  const onOff = (label, flag) => {
    return <div>{label}: {flag ? "on" : "off"}</div>;
  }

  const currentSettings =
    <div className='tooltip-text'>
      {onOff("Hard Mode", hardMode)}
      {onOff("All Guesses", allGuesses)}
      {onOff("Monochrome Mode", showBW)}
    </div>;

  return (
    <PopupDoc label={SettingsEmoji()} tooltip={currentSettings} ok="OK"  labelClass='enlarge-emoji'>
      <FormGroup>
        <FormControlLabel control={<Switch checked={hardMode} onChange={()=>setHardMode(!hardMode)} />} label="Hard Mode" />
        <FormControlLabel control={<Switch checked={allGuesses} onChange={()=>setAllGuesses(!allGuesses)} />} label="Allow All Guesses" />
        <FormControlLabel control={<Switch checked={showBW} onChange={()=>setShowBW(!showBW)} />} label=" Monochrome Mode" />
      </FormGroup>
    </PopupDoc>
  );  
}
