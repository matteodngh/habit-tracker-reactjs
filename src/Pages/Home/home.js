import React, { useState, useEffect } from 'react';
import {
  Typography, Box, ListItemIcon, Checkbox,
  ListItemText, ListItem, List, Grid, LinearProgress,
  linearProgressClasses, Button, ListSubheader, ListItemButton, IconButton, TextField, Snackbar,
} from '@mui/material';
import { makeStyles, styled } from '@mui/styles';

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import StaticDatePicker from "@mui/lab/StaticDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import NavBar from '../../components/NavBar';

import { DATA } from '../../utils/datahabits';
import AddModal from '../../components/AddModal';

import NavTabs from '../../components/Nav';

const materialTheme = makeStyles((theme) => ({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: "#8bc34a",
      },
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        backgroundColor: "white",
        color: "#1b5e20",
      },
    },
  },
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8"
  }
}));

function Home() {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const [date, setDate] = useState(new Date());
  const [dailychecks, setDailyChecks] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    var token = localStorage.getItem('HT_token');
    var user_id = localStorage.getItem('user_id');
    fetch(`http://192.168.1.6:8000/api/dailychecks/?date=${(new Date(date.getTime() - (new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0]}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => res.json())
      .then(jsonRes => {
        const tmp = []
        jsonRes.map((temp) => {
          if (temp.habit_user === parseInt(user_id)) {
            tmp.push(temp);
          }
        })
        setDailyChecks(tmp);
      })
      .catch(err => console.log(err))
  }, [date, update])

  const changeDailyCheck = (item) => {
    var token = localStorage.getItem('HT_token');
    fetch(`http://192.168.1.6:8000/api/dailychecks/${item.id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ done: !item.done })
    })
      .then(setUpdate(!update))
      .catch(err => console.log(err))
  }

  const isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
  }

  const pull_data = () => {
    setUpdate(!update);
  }

  return (
    <div>
      <NavBar />
      <NavTabs />
      <Grid container>
        <Grid container item sm={3}
          alignItems="flex-start"
          justifyContent="center"
        >
          <LocalizationProvider dateAdapter={AdapterDateFns} theme={materialTheme}>
            <StaticDatePicker
              showDaysOutsideCurrentMonth={true}
              open={true}
              variant="static"
              showToolbar={false}
              displayStaticWrapperAs="desktop"
              orientation="portrait"
              openTo="day"
              value={date}
              onChange={(newValue) => {
                setDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item sm={4}
          alignItems="flex-start"
          justifyContent="center"
        >
          {dailychecks.length === 0 ?
            ((new Date(date.getTime() - (new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0] === (new Date(new Date().getTime() - (new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0] ?
              <Typography mx={6} my={5} fontSize={20} color="primary" variant="h6">No daily habits today. Start One!</Typography> :
              <Typography mx={15} my={5} fontSize={20} color="primary" variant="h6">No daily habits!</Typography>) :
            <Box>
              <Box sx={{ width: '100%', flexGrow: 1 }}>
                <Typography variant="h6" color="text.primary" mt={2}>
                  {isToday(date) ? 'Today\'s'
                    : date.toLocaleDateString(
                      'en-GB',
                      { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })} habits completed at {`${~~((dailychecks.filter(x => x.done).length * 100) / dailychecks.length)}%`}
                </Typography>
                <BorderLinearProgress
                  sx={{
                    height: 15,
                    border: 1,
                    borderColor: '#d9d9d9'
                  }}
                  variant="determinate"
                  value={~~((dailychecks.filter(x => x.done).length * 100) / dailychecks.length)} />
              </Box>
              <List
                sx={{ width: '100%', bgcolor: 'background.paper' }}
              >
                {dailychecks.map((value, i) => {
                  return (
                    <ListItem
                      key={i}
                      divider
                    >
                      <ListItemIcon
                        disabled={
                          new Date(date).getTime() <= new Date().getTime() ? false : true}
                        onClick={() => {
                          new Date(date).getTime() <= new Date().getTime() ?
                            changeDailyCheck(value) : setOpen(true)
                        }}
                      >
                        <Checkbox
                          checked={value.done}
                        />
                      </ListItemIcon>
                      <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        open={open}
                        onClose={handleClose}
                        message="It's not time to think in future!"
                      />
                      <ListItemText secondary={`${value.habit_name}`} />
                    </ListItem>
                  );
                })}
              </List>
            </Box>}
        </Grid>
        <Grid container item sm={5}
          alignItems="flex-start"
          justifyContent="center"
        >
          <Box
            border={3} borderColor="primary.main" borderRadius={10}
            justifyContent="center" alignItems="center" display='flex' p={1} px={3} mb={1}
          >
            <AddModal func={pull_data} />
            <Typography color='primary.main'>ADD CUSTOM HABIT</Typography>
          </Box>
          <List
            sx={{
              width: '80%',
              maxWidth: 500,
              position: 'relative',
              overflow: 'auto',
              maxHeight: 500,
              '& ul': { padding: 0 },
              border: 1,
              borderColor: '#cceeff'
            }}
            subheader={<li />}
          >
            {DATA.map((sectionId) => (
              <li key={`${sectionId.header}`}>
                <ul>
                  <ListSubheader
                    sx={{ backgroundColor: '#80d4ff', fontWeight: 'bold', fontSize: 18 }}>
                    {`${sectionId.header}`}
                  </ListSubheader>
                  {sectionId.data.map((item) => (
                    <ListItem key={`item-${sectionId.header}-${item.text}`} divider sx={{ height: 40 }}>
                      <AddModal title={item.text} func={pull_data} />
                      <ListItemText secondary={`${item.text}`} />
                    </ListItem>
                  ))}
                </ul>
              </li>
            ))}
          </List>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;
