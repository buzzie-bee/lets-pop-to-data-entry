import { Container, makeStyles, Typography } from '@material-ui/core';

export const Progress = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" className={classes.headline}>
        Lets Pop To Data Entry
      </Typography>
      <Typography variant="h5" className={classes.welcome}>
        Not implemented yet
      </Typography>
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
