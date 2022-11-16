import { Box, Button, TextField, Modal, ListItemIcon, Alert, Typography, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useForm } from 'react-hook-form';
import Edit from '@mui/icons-material/Edit';

const useStyles = makeStyles((theme) => ({

}));

const EditModal = (props) => {
  const classes = useStyles();

  const habit = props.habit;

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    var token = localStorage.getItem('HT_token');
    fetch(`http://192.168.1.6:8000/api/habits/${habit.id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description
      })
    })
      .then(props.func())
      .then(handleClose())
      .catch(err => console.log(err))
  };

  return (
    <div>
      <Edit onClick={handleOpen} />
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant='h5'>Edit Habit</Typography>
            <Box my={2}>
              <TextField
                variant="outlined"
                label="Title"
                defaultValue={habit.title}
                fullWidth
                autoComplete="Title"
                autoFocus
                {...register("title", {
                  required: "Title is required",
                })}
                error={!!errors?.title}
                helperText={errors?.title ? errors.title.message : null}
              />
            </Box>
            <Box mb={2}>
              <TextField
                variant="outlined"
                label="Description"
                fullWidth
                defaultValue={habit.description}
                autoComplete="Description"
                {...register("description", {
                  required: "description is required",
                  minLength: {
                    value: 3,
                    message: 'Description should be minimum 3 characters long',
                  },
                })}
                error={!!errors?.description}
                helperText={errors?.description ? errors.description.message : null}
              />
            </Box>
            <Box mb={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                EDIT
              </Button>
            </Box>
          </form>
        </Box>
      </Modal >
    </div>
  );
}

export default EditModal; 