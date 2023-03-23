import React, { useState } from 'react';
import './link-button.scss';
import './popup-doc.scss';
import {
  QuestionEmoji
} from './util/Emojis';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import './App.scss';

export default function PopupDoc({children, label, tooltip, ok, fontSize}) {
  const [ show, setShow ] = useState(false);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  const buttonLabel = label ? label : <div className='default-anchor'><sup>{QuestionEmoji()}</sup></div>;

  return (
    <>
      <Tooltip title={tooltip}>
        <Button sx={{fontSize: {fontSize}}} onClick={handleOpen}>{buttonLabel}</Button>
      </Tooltip>
      <Dialog open={show} handleClose={handleClose} onBackdropClick={handleClose} >
        <DialogContent>
          {children}
        </DialogContent>
        {ok &&
         <DialogActions>
           <Button onClick={handleClose}>{ok}</Button>
         </DialogActions>
        }
      </Dialog>
    </>
  );
}

