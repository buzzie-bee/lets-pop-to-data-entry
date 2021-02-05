import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Container,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';

export const Loader = () => {
  const [timerVal, setTimerVal] = useState(5);
  const { searchQuery } = useParams();
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    if (timerVal <= 0) {
      history.push(`/entry/${searchQuery}`);
    } else {
      setTimeout(() => {
        setTimerVal(timerVal - 1);
      }, 1000);
    }
  }, [timerVal, searchQuery, history]);

  return (
    <Container maxWidth="lg">
      <Grid
        className={classes.grid}
        container
        direction="column"
        justify="center"
        alignItems="stretch"
        wrap="nowrap"
        spacing={8}
      >
        <Grid item>
          <div className={classes.gridRow}>
            <Typography variant="h2">Entry Complete</Typography>
          </div>
        </Grid>
        <Grid item>
          <div className={classes.countdownContainer}>
            <div className={classes.gridRow}>
              <Typography variant="overline">Next location:</Typography>
            </div>

            <div className={classes.gridRow}>
              <Typography variant="h4">{searchQuery}</Typography>
            </div>
          </div>
        </Grid>

        <Grid item>
          <div className={classes.countdownContainer}>
            <div className={classes.gridRow}>
              <Typography variant="overline">Redirecting in:</Typography>
            </div>
            <div className={classes.gridRow}>
              <Typography variant="h3">{timerVal}</Typography>
            </div>
          </div>
        </Grid>
        <Grid item>
          <div className={classes.gridRow}>
            <Grid
              item
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={8}
            >
              <Grid item>
                <Button
                  color="secondary"
                  size="large"
                  onClick={() => {
                    history.push(`/entry`);
                  }}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color="primary"
                  size="large"
                  onClick={() => {
                    history.push(`/entry/${searchQuery}`);
                  }}
                >
                  Go now
                </Button>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  grid: {
    marginTop: '32px',
    height: '500px',
  },
  gridRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
}));
