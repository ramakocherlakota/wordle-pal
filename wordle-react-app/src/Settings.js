import React, { useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { SettingsEmoji } from './util/Emojis.js';

export default function Settings({ hardMode, setHardMode, quordle, setQuordle, allGuesses, setAllGuesses }) {
  const [ show, setShow ] = useState(false);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  const onOff = (label, flag) => {
    return <div>{label}: {flag ? "on" : "off"}</div>;
  }

  const currentSettings =
    <div>
      Current Settings
      {onOff("Quordle", quordle)}
      {onOff("Hard Mode", hardMode)}
      {onOff("All Guesses", allGuesses)}
    </div>;

  return (
    <>
      <Tooltip title={currentSettings}>
        <Button onClick={handleOpen}>{SettingsEmoji()}</Button>
      </Tooltip>
      <Dialog open={show} handleClose={handleClose} onBackdropClick={handleClose} >
        <DialogContent>
          <FormGroup>
            <FormControlLabel control={<Switch checked={quordle} onChange={()=>setQuordle(!quordle)} />} label="Quordle Mode" />
          </FormGroup>
          <FormGroup>
            <FormControlLabel control={<Switch checked={hardMode} onChange={()=>setHardMode(!hardMode)} />} label="Hard Mode" />
          </FormGroup>
          <FormGroup>
            <FormControlLabel control={<Switch checked={allGuesses} onChange={()=>setAllGuesses(!allGuesses)} />} label="Allow All Guesses" />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );  
}
