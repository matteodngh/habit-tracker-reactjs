import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

export default function LogoutDialog() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('HT_token');
    localStorage.removeItem('user_id');
    navigate('/');
  }

  return (
    <div>
      <Button color="inherit" endIcon={<LogoutIcon />} onClick={handleClickOpen}>Logout</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure to Logout?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={logout}>Yes, I'm sure</Button>
          <Button onClick={handleClose} autoFocus>
            No, I'm not
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}