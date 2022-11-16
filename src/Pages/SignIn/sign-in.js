import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, Container, Box, Alert, Grid, Snackbar } from '@mui/material';
import Logo from '../../assets/images/logo.png'
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();



  useEffect(() => {
    const token = localStorage.getItem('HT_token');
    if (token) {
      navigate("Home");
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    fetch(`http://192.168.1.6:8000/auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: data.username, password: data.password })
    })
      .then(res => res.json())
      .then(res => {
        if (res.token) {
          localStorage.setItem('HT_token', res.token);
          localStorage.setItem('user_id', res.user_id);
          navigate("/home");
        } else {
          setOpen(true);
        }
      })
      .catch(err => console.log(err))
  };

  const onForgotPasswordPressed = () => {
    navigate('forgot-password');
  };

  const onSignUpPress = () => {
    navigate('signup');
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
        <div>
          <img src={Logo} width={250} alt='logo' height={250} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={2}>
            <TextField
              variant="outlined"
              label="Username"
              fullWidth
              autoComplete="Username"
              autoFocus
              {...register("username", {
                required: "Username is required",
              })}
              error={!!errors?.username}
              helperText={errors?.username ? errors.username.message : null}
            />
          </Box>
          <Box mb={2}>
            <TextField
              variant="outlined"
              type="password"
              label="Password"
              fullWidth
              autoComplete="Password"
              {...register("password", {
                required: "password is required",
                minLength: {
                  value: 3,
                  message: 'Password should be minimum 3 characters long',
                },
              })}
              error={!!errors?.password}
              helperText={errors?.password ? errors.password.message : null}
            />
          </Box>

          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={open}
            onClose={handleClose}
            message="Credentials are not valid."
          />
          <Box mb={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login In
            </Button>
          </Box>
          <Box mb={2}>
            <Button variant="text" color="primary" fullWidth onClick={onForgotPasswordPressed}>
              Forgot password?
            </Button>
          </Box>
          <Box mb={2}>
            <Button variant="text" color="secondary" fullWidth onClick={onSignUpPress}>
              Don't have an account? Create one
            </Button>
          </Box>
        </form>
      </Grid>
    </Grid>
  );
}



export default SignIn;
