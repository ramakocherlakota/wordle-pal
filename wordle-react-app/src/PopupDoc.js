import React, { useState } from 'react';
import './link-button.scss';
import './popup-doc.scss';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import './App.scss';

export default function PopupDoc({children, label, tooltip, ok}) {
  const [ show, setShow ] = useState(false);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  const buttonLabel = <div className="button-label">{label}</div>;

  return (
    < >
      {
        tooltip
          ? <Tooltip title={tooltip}>
              <Button onClick={handleOpen}>{buttonLabel}</Button>
            </Tooltip>
        : <Button onClick={handleOpen}>{buttonLabel}</Button>
      }
      <Dialog open={show} onClose={handleClose} onBackdropClick={handleClose} >
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

