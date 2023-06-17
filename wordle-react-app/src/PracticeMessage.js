import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export default function PracticeMessage({ message, setMessage }) {
  const { title, content, actions } = message;
  const close = () => setMessage(null);
  const actionButtons = actions.map(action => {
    const { label, func } = action;
    const handler = func ? () => {
      func();
      close()
    } : () => close();
    return <Button onClick={handler}>{label</Button>;
  });
  return (
      <Dialog open={message !== null}
        onClose={close} >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {actionButtons}
      </DialogActions>
      </Dialog>
  );
}
