import { Container, makeStyles, Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import { UserContext } from '../../firebase/UserProvider';

export const HomePage = () => {
  const classes = useStyles();
  const user = useContext(UserContext);

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" className={classes.headline}>
        Lets Pop To Data Entry
      </Typography>
      {user.displayName.length ? (
        <Typography variant="h5" className={classes.welcome}>
          Welcome {user.displayName.split(' ')[0]}
        </Typography>
      ) : (
        <Typography>Please Login to begin</Typography>
      )}
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  headline: {
    paddingTop: theme.spacing(2),
  },
  welcome: {
    padding: '8px',
  },
}));
