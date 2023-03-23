import React, { useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import PopupDoc from './PopupDoc';
import { SettingsEmoji } from './util/Emojis.js';
import './Settings.scss';

export default function Settings({ hardMode, setHardMode, quordle, setQuordle, allGuesses, setAllGuesses }) {
  const [ show, setShow ] = useState(false);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  const onOff = (label, flag) => {
    return <div>{label}: {flag ? "on" : "off"}</div>;
  }

  const currentSettings =
    <div className='tooltip-text'>
      Current Settings
      {onOff("Quordle", quordle)}
      {onOff("Hard Mode", hardMode)}
      {onOff("All Guesses", allGuesses)}
    </div>;

  return (
    <PopupDoc label={SettingsEmoji()} tooltip={currentSettings} ok="OK" fontSize="60px">
      <FormGroup>
        <FormControlLabel control={<Switch checked={quordle} onChange={()=>setQuordle(!quordle)} />} label="Quordle Mode" />
      </FormGroup>
      <FormGroup>
        <FormControlLabel control={<Switch checked={hardMode} onChange={()=>setHardMode(!hardMode)} />} label="Hard Mode" />
      </FormGroup>
      <FormGroup>
        <FormControlLabel control={<Switch checked={allGuesses} onChange={()=>setAllGuesses(!allGuesses)} />} label="Allow All Guesses" />
      </FormGroup>
    </PopupDoc>
  );  
}
