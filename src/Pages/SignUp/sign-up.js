import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, Container, Box, Typography, Grid, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch('password');

  const generateCode = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  const onSubmit = data => {
    const code = generateCode();
    fetch(`http://192.168.1.6:8000/send/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: data.email,
        subject: 'CONFIRMATION EMAIL - HABIT TRACKER',
        message: `Hi ${data.name}! Thank you for subscribe. Your code for complete the registration is ${code}`
      })
    })
      .then(res => res.json())
      .then(res => {
        res.message === 'e-mail already exists' ? setOpen(true)
          : navigate('/confirm-email', {
            state: {
              user: {
                username: data.username,
                password: data.password,
                name: data.name,
                email: data.email
              },
              code: code
            }
          })
      })
      .catch(err => console.log(err))
  };

  const onSignInPress = () => {
    navigate('/');
  };

  return (
    <Grid container justifyItems='center' alignItems='center' justifyContent="center" p={5}
      bgcolor='#f0f2f5' height={window.innerHeight} widht={window.innerWidth} >
      <Grid container item sm={4}
        alignItems="center"
        justifyContent="center"
        borderRadius={10}
        bgcolor='white'
        boxShadow={20}
      >
        <Box m={3}>
          <Typography fontSize={24} color="primary">Create a new account</Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={1.5}>
            <TextField
              variant="outlined"
              label="Name"
              fullWidth
              autoComplete="Name"
              autoFocus
              {...register("name", {
                required: "name is required",
                minLength: {
                  value: 3,
                  message: 'Name should be at least 3 characters long',
                },
                maxLength: {
                  value: 24,
                  message: 'Name should be max 24 characters long',
                },
              })}
              error={!!errors?.name}
              helperText={errors?.name ? errors.name.message : null}
            />
          </Box>
          <Box mb={1.5}>
            <TextField
              variant="outlined"
              label="Username"
              fullWidth
              autoComplete="Username"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: 'Username should be at least 3 characters long',
                },
                maxLength: {
                  value: 24,
                  message: 'Username should be max 24 characters long',
                },
              })}
              error={!!errors?.username}
              helperText={errors?.username ? errors.username.message : null}
            />
          </Box>
          <Box mb={1.5}>
            <TextField
              variant="outlined"
              label="Email"
              fullWidth
              autoComplete="email"
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
          <Box mb={1.5}>
            <TextField
              type="password"
              variant="outlined"
              label="Password"
              fullWidth
              autoComplete="Password"
              {...register("password", {
                required: "password is required",
                minLength: {
                  value: 8,
                  message: 'Password should be at least 8 characters long',
                },
              })}
              error={!!errors?.password}
              helperText={errors?.password ? errors.password.message : null}
            />
          </Box>
          <Box mb={1.5}>
            <TextField
              type="password"
              variant="outlined"
              label="Repeat Password"
              fullWidth
              autoComplete="Repeat Password"
              {...register("passwordreapeat", {
                validate: value => value === password || 'Password do not match',
              })}
              error={!!errors?.passwordreapeat}
              helperText={errors?.passwordreapeat ? errors.passwordreapeat.message : null}
            />
          </Box>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={open}
            onClose={handleClose}
            message="This email already exists. Sign In."
          />
          <Box mb={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Register
            </Button>
          </Box>
          <Box mb={2}>
            <Button variant="text" color="secondary" fullWidth onClick={onSignInPress}>
              Already have an account? Sign In
            </Button>
          </Box>
        </form>
      </Grid >
    </Grid >
  );
}



export default SignUp;