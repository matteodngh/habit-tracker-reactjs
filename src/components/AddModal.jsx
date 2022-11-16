import { Box, Button, TextField, Modal, ListItemIcon, Alert, Typography, ListItemButton, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useForm } from 'react-hook-form';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateRangePicker from '@mui/lab/DateRangePicker';

const useStyles = makeStyles((theme) => ({
}));

const AddModal = (props) => {
  const classes = useStyles();

  const title = props.title;

  const [value, setValue] = React.useState([null, null]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function CheckError(response) {
    if (response.status >= 200 && response.status <= 299) {
      return false
    } else {
      return true
    }
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    var token = localStorage.getItem('HT_token');
    var user_id = localStorage.getItem('user_id');
    if (value[0] === null || value[1] == null) {
      <Alert>Please select the range of dates</Alert>
    } else {
      fetch(`http://192.168.1.6:8000/api/habits/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          public: false,
          sdate: (new Date(value[0].getTime() - (new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0],
          edate: (new Date(value[1].getTime() - (new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0],
          created_by: user_id
        })
      })
        .then(CheckError)
        .then((res) => {
          res ? <Alert>There is already an habit with this title</Alert> :
            setOpen(false)
        })
        .then(props.func())
        .catch(err => console.log(err))
    }
  };
  return (
    <div>
      <IconButton onClick={handleOpen} >
        <AddCircleOutlineOutlinedIcon />
      </IconButton>

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
            <Typography variant='h5'>Add New Habit</Typography>
            <Box my={2}>
              <TextField
                variant="outlined"
                label="Title"
                value={title}
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
                autoComplete="Description"
                autoFocus
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateRangePicker
                  disablePast
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                  renderInput={(startProps, endProps) => (
                    <React.Fragment>
                      <TextField {...startProps} />
                      <Box sx={{ mx: 2 }}> to </Box>
                      <TextField {...endProps} />
                    </React.Fragment>
                  )}
                />
              </LocalizationProvider>
            </Box>
            <Box mb={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                ADD
              </Button>
            </Box>
          </form>
        </Box>
      </Modal >
    </div>
  );
}

export default AddModal; 