import React, { useState } from 'react';
import './link-button.scss';
import './popup-doc.scss';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import './App.scss';

export default function PopupDoc({children, label, tooltip, ok, okAction, labelClass}) {
  const [ show, setShow ] = useState(false);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  const okClose = () => {
    if (okAction) {
      okAction();
    }
    handleClose();
  }

  const labelClassName = labelClass ? labelClass : "";
  const buttonLabel = <div className={labelClassName}>{label}</div>;
  const buttonOrLabel = children ? <Button onClick={handleOpen}>{buttonLabel}</Button> : <div className={labelClassName}>{label}</div>;

  return (
    < >
      {
        tooltip
          ? <Tooltip title={tooltip}>
              {buttonOrLabel}
            </Tooltip>
        : buttonOrLabel
      }
      <Dialog open={show} onClose={handleClose} onBackdropClick={handleClose} >
        <DialogContent>
          {children}
        </DialogContent>
        {ok &&
         <DialogActions>
           <Button onClick={okClose}>{ok}</Button>
         </DialogActions>
        }
      </Dialog>
    </>
  );
}

