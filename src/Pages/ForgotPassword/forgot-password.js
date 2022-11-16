import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, Container, Box, Typography, Alert, Grid, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const generateCode = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text
  }

  const testEmail = (user) => {
    var code = generateCode();
    fetch(`http://192.168.1.6:8000/forgot/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user.email,
        subject: 'FORGOT PASSWORD - HABIT TRACKER',
        message: `Hi ${user.username}! Your code for reset a new password is ${code}`,
      })
    })
      .then(navigate('/new-password', { state: { user: user, code: code } }))
  };

  const onSubmit = data => {
    fetch(`http://192.168.1.6:8000/api/users/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(jsonRes => {
        jsonRes.find((item) => item.email === data.email ?
          testEmail(item) :
          setOpen(true)
        )
      })
      .catch(err => console.log(err))
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
        <Box m={2}>
          <Typography fontSize={24} color="primary">Forgot Password</Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={2}>
            <TextField
              variant="outlined"
              label="Email"
              fullWidth
              autoComplete="email"
              autoFocus
              {...register("email", {
                required: "Required field",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              error={!!errors?.email}
              helperText={errors?.email ? errors.email.message : null}
            />
          </Box>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={open}
            onClose={handleClose}
            message="This email not exists. Try again."
          />
          <Box mb={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Send
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

export default ForgotPassword;
