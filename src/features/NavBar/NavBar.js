import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Button, Link, makeStyles, Toolbar } from '@material-ui/core';
import { signInWithGoogle, signOut } from '../../firebase/login';
import { UserContext } from '../../firebase/UserProvider';

export const NavBar = () => {
  const classes = useStyles();
  const user = useContext(UserContext);

  const renderAuthButton = () => {
    if (!user) {
      return (
        <Button
          href="#"
          color="inherit"
          variant="outlined"
          className={classes.link}
          onClick={() => {
            signInWithGoogle();
          }}
        >
          Login
        </Button>
      );
    } else {
      return (
        <Button
          href="#"
          color="inherit"
          variant="outlined"
          className={classes.link}
          onClick={() => {
            signOut();
          }}
        >
          Log Out
        </Button>
      );
    }
  };
  return (
    <AppBar position="static" elevation={0} className={classes.appBar}>
      <Toolbar>
        <Link
          component={RouterLink}
          to="/"
          variant="h6"
          color="inherit"
          underline="none"
          noWrap
          className={classes.toolbarTitle}
        >
          Lets Pop To Data Entry
        </Link>

        <nav>
          <Link
            component={RouterLink}
            variant="button"
            color="textPrimary"
            to="/entry"
            className={classes.link}
          >
            Data Entry
          </Link>
          <Link
            component={RouterLink}
            variant="button"
            color="textPrimary"
            to="/progress"
            className={classes.link}
          >
            Progress
          </Link>
        </nav>
        {renderAuthButton()}
      </Toolbar>
    </AppBar>
  );
};

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `2px solid ${theme.palette.divider}`,
    background:
      'linear-gradient(90deg, rgba(95,11,136,1) 0%, rgba(153,51,204,1) 50%, rgba(191,83,245,1) 100%)',
    height: '5em',
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
    color: '#fff',
  },
}));
