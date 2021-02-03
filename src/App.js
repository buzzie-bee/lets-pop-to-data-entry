import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { HomePage } from './features/HomePage/HomePage';
import { DataEntry } from './features/DataEntry/DataEntry';
import { NavBar } from './features/NavBar/NavBar';
import UserProvider from './firebase/UserProvider';
import { ImageSelector } from './features/DataEntry/ImageSelector/ImageSelector';

function App() {
  const classes = useStyles();
  return (
    <div>
      <BrowserRouter>
        <UserProvider>
          <NavBar />
          <div className={classes.root}>
            <Switch>
              <Route exact path="/">
                <HomePage />
              </Route>
              <Route exact path="/entry">
                <DataEntry />
              </Route>
              <Route exact path="/entry/:searchQuery">
                <ImageSelector />
              </Route>
            </Switch>
          </div>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[800],
  },
}));
