import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, Container, Box, Typography, Grid, Snackbar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

function ConfirmEmail() {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { state } = useLocation();
  const { user, code } = state;
  let checkCode = code;
  const navigate = useNavigate();

  const onSubmit = data => {
    if (data.code === checkCode) {
      fetch(`http://192.168.1.6:8000/api/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: user.username,
          password: user.password,
          email: user.email,
          first_name: user.name
        })
      })
        .then(navigate('/'))
        .catch(err => console.log(err))
    } else {
      setOpen(true);
    }
  };

  const generateCode = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text
  }

  const testEmail = (user) => {
    var newCode = generateCode();
    fetch(`http://192.168.1.6:8000/send/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user.email,
        subject: 'FORGOT PASSWORD - HABIT TRACKER',
        message: `Hi ${user.username}! Your code for reset a new password is ${newCode}`,
      })
    })
      .then(res => { checkCode = newCode })
  };

  return (
    <Grid container justifyItems='center' alignItems='center' p={5} bgcolor='#f0f2f5'
      height={window.innerHeight} widht={window.innerWidth} justifyContent="center">
      <Grid container item sm={4}
        alignItems="center"
        justifyItems='center'
        justifyContent="center"
        flexDirection="column"
        borderRadius={10}
        bgcolor='white'
        boxShadow={20}
      >
        <Box m={3}>
          <Typography fontSize={24} color="primary">Confirm your email</Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={2}>
            <TextField
              variant="outlined"
              label="Code"
              fullWidth
              autoComplete="Code"
              autoFocus
              {...register("code", {
                required: "Code is required",
              })}
              error={!!errors?.code}
              helperText={errors?.code ? errors.code.message : null}
            />
          </Box>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={open}
            onClose={handleClose}
            message="Code is not valid. Resend it."
          />
          <Box mb={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Confirm
            </Button>
          </Box>
          <Box mb={2}>
            <Button variant="outlined" color="primary" fullWidth onClick={() => testEmail(user)}>
              Resend Code
            </Button>
          </Box>
          <Box mb={2}>
            <Button variant="text" color="secondary" fullWidth onClick={() => navigate('/')}>
              Back to Sign In
            </Button>
          </Box>
        </form>
      </Grid>
    </Grid>
  );
}

export default ConfirmEmail;
