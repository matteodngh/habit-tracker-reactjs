import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DeleteDialog(props) {
  const [open, setOpen] = React.useState(false);
  const habit_id = props.habit_id;
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteHabit = () => {
    var token = localStorage.getItem('HT_token');
    fetch(`http://192.168.1.6:8000/api/habits/${habit_id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(props.func())
      .then(handleClose)
      .catch(err => console.log(err))
  }

  return (
    <div>
      <DeleteIcon onClick={handleClickOpen} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={deleteHabit}>Yes, I'm sure</Button>
          <Button onClick={handleClose} autoFocus>
            No, I'm not
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}