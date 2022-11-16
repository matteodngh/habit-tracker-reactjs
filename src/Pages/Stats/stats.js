import React, { useState, useEffect } from 'react';
import {
  Typography, Box, ListItemText, List,
  Grid, ListItemButton, Modal, ListSubheader, IconButton, CircularProgress, Button, ListItem
} from '@mui/material';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { makeStyles, withStyles } from '@mui/styles';

import { summary } from 'date-streaks';
import NavBar from '../../components/NavBar';

import { useNavigate } from 'react-router-dom';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Datepicker, Page, setOptions } from '@mobiscroll/react';
import EditModal from '../../components/EditModal';
import { useLocation } from 'react-router-dom';
import NavTabs from '../../components/Nav';
import DeleteDialog from '../../components/DeleteDialog';

const useStyles = makeStyles((theme) => ({
  container: {
  },
  progress: {
    width: 200,
    height: 200,
    margin: theme.spacing(3)
  },
  summary: {
    padding: theme.spacing(1)
  },
}));


function Stats() {
  const classes = useStyles();

  const [dailychecks, setDailyChecks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [update, setUpdate] = useState(false);
  const [dates, setDates] = useState([]);
  const [colors, setColors] = useState([]);



  useEffect(() => {
    var token = localStorage.getItem('HT_token');
    var user_id = localStorage.getItem('user_id');
    fetch(`http://192.168.1.6:8000/api/habits/?created_by=${user_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => res.json())
      .then(jsonRes => {
        var completed = [];
        var notcompleted = [];
        jsonRes.map((item) => (
          new Date(item.edate).getTime() < new Date(new Date().toISOString().split('T')[0]).getTime() ?
            completed.push(item) :
            notcompleted.push(item)

        ));
        setHabits([
          { header: "HABITS IN PROGRESS", data: notcompleted },
          { header: "FINISHED HABITS", data: completed },
        ]);
      })
      .catch(err => console.log(err))
  }, [update])

  const searchDailyhabits = (habit_id, index) => {
    setUpdate(!update);
    setSelectedIndex(index);
    var token = localStorage.getItem('HT_token');
    fetch(`http://192.168.1.6:8000/api/dailychecks/?habit=${habit_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        setDailyChecks(res);
        var dd = [];
        res.forEach(x => { if (x.done) dd.push(new Date(x.date)) });
        setDates(dd);
        var clrs = [];
        res.map((item) => {
          clrs.push({
            date: new Date(new Date(item.date).getFullYear(), new Date(item.date).getMonth(), new Date(item.date).getDate()),
            background: item.done ? '#00b300' : '#ff1a1a',
          });
        }
        );
        setColors(clrs);
      })
      .catch(err => console.log(err))
  }

  const pull_data = () => {
    setSelectedIndex(-1);
    setUpdate(!update);
  }

  return (
    <div>
      <NavBar />
      <NavTabs />
      <Grid container >
        <Grid
          container item sm={4}
        >
          <Box sx={{ width: '100%' }}>
            <Box sx={{ width: '90%', marginLeft: 2 }}>
              <Typography variant="h6" color="text.primary" mt={2}>
                My List of Habits
              </Typography>
            </Box>
            <List
              sx={{
                width: '90%',
                maxWidth: 500,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 500,
                '& ul': { padding: 0 },
              }}
              subheader={<li />}
            >
              {habits.map((sectionId, i) => (
                <li key={`${i}`}>
                  <ul>
                    <ListSubheader
                      sx={{
                        color: sectionId.header === "HABITS IN PROGRESS" ? 'green' : 'red',
                      }}
                    >
                      {`${sectionId.header}`}
                    </ListSubheader>
                    {sectionId.data.map((item, j) => (
                      <ListItem
                        sx={{
                          "&.Mui-selected": {
                            backgroundColor: "#ccf2ff",
                            '&:hover': {
                              backgroundColor: '#ccf2ff'
                            }
                          },
                        }}
                        key={`item-${i}-${j}`
                        }
                        divider
                        button
                        onClick={() => searchDailyhabits(item.id, (i === 0 ? -j - 1 : j))}
                        selected={selectedIndex === (i === 0 ? -j - 1 : j)}
                        secondaryAction={
                          <>
                            <IconButton edge="end" aria-label="edit" sx={{ marginRight: 0.5 }}>
                              <EditModal habit={item} func={pull_data} />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete">
                              <DeleteDialog habit_id={item.id} func={pull_data} />
                            </IconButton>
                          </>
                        }
                      >
                        <ListItemText primary={`${item.title.toUpperCase()}`} />
                      </ListItem>
                    ))}
                  </ul>
                </li>
              ))}
            </List>
          </Box>
        </Grid>
        <Grid item container sm={8} direction='row'>
          <Grid
            container
            direction="column"
            item sm={6}
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant='h6'>Summary</Typography>
            <div className={classes.progress}>
              <CircularProgressbar
                value={~~((dailychecks.filter(x => x.done).length * 100) / dailychecks.length)}
                text={`${~~((dailychecks.filter(x => x.done).length * 100) / dailychecks.length)}%`}
              />
            </div>
            <div >
              <Typography variant='subtitle1' className={classes.summary}>
                {`LONGEST STREAK: ${summary(dates).longestStreak}`}
              </Typography>
              <Typography variant='subtitle1' className={classes.summary}>
                {`CURRENT STREAK: ${summary(dates).currentStreak}`}
              </Typography>
              <Typography variant='subtitle1' style={{ color: 'green' }} className={classes.summary}>
                {`COMPLETED DAYS: ${dailychecks.filter(x => x.done).length}`}
              </Typography>
              <Typography variant='subtitle1' style={{ color: 'red' }} className={classes.summary}>
                {`INCOMPLETED DAYS: ${dailychecks.filter(x => x.done === false).length}`}
              </Typography>
            </div>
          </Grid>
          <Grid container item sm={6}
            alignItems="center"
            justifyContent="center"
          >
            <div className="mbsc-col-sm-12 mbsc-col-md-4">
              <div className="mbsc-form-group">
                <div className="mbsc-form-group-title">Heatmap</div>
                <Datepicker
                  controls={['calendar']}
                  display="inline"
                  colors={colors}
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div >
  );
}

export default Stats;
