import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, Container, Box, Typography, Grid } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

function NewPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { state } = useLocation();
  const { user, code } = state;
  const navigate = useNavigate();

  const onSubmit = data => {
    if (data.code === code) {
      fetch(`http://192.168.1.6:8000/api/users/${user.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: data.password,
        })
      })
        .then(navigate('/'))
        .catch(err => console.log(err))
    }
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
          <Box mb={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
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

export default NewPassword;
