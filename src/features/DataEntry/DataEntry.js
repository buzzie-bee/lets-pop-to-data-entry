import {
  Button,
  Container,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/firebase';

export const DataEntry = () => {
  const [nextFewDocuments, setNextFewDocuments] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [completed, setCompleted] = useState(0);
  const classes = useStyles();

  const fetchNextTenDocuments = async () => {
    const documents = [];

    try {
      const locationsRef = await db.collection('locations');
      const querySnapshot = await locationsRef
        .where('imgUrl', '==', '')
        .orderBy('occurances', 'desc')
        .limit(10)
        .get();
      querySnapshot.forEach((doc) => {
        documents.push(doc.data());
      });
      setNextFewDocuments(documents);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchStats = async () => {
    try {
      const doc = await db.collection('stats').doc('stats').get();

      if (doc.exists) {
        const { total, count } = doc.data();
        if (!total || !count) {
          console.log('no stats found');
          return;
        }
        setTotal(total);
        setCompleted(count);
        setStatsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchNextTenDocuments();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" className={classes.headline}>
        Data Entry Portal
      </Typography>
      <div style={{ marginTop: '32px' }} />
      <Button
        component={Link}
        to={
          nextFewDocuments.length
            ? `/entry/${nextFewDocuments[0].query}`
            : '/entry'
        }
        size="large"
        color="primary"
        variant="contained"
      >
        Start Logging
      </Button>
      <div style={{ marginTop: '32px' }} />
      <span>
        <Typography variant="h6" display="inline">
          Completed:{' '}
        </Typography>
        <Typography variant="h5" display="inline">
          {statsLoading ? 'loading' : completed}
        </Typography>
      </span>
      <div style={{ marginTop: '8px' }} />
      <span>
        <Typography variant="h6" display="inline">
          Total:{' '}
        </Typography>
        <Typography variant="h5" display="inline">
          {statsLoading ? 'loading' : total}
        </Typography>
      </span>

      <div style={{ marginTop: '32px' }} />
      <Typography variant="h6">Next few records:</Typography>
      <TableContainer component={Paper} className={classes.table}>
        <Table className={classes.table} aria-label="table of next locations">
          <TableHead>
            <TableRow key={`thr`} component="tr" scope="row">
              <TableCell>IATA</TableCell>
              <TableCell>SkyCode</TableCell>
              <TableCell>Query</TableCell>
              <TableCell>Frequency</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nextFewDocuments.map((document, idx) => {
              return (
                <TableRow key={`tr ${idx}`} component="tr" scope="row">
                  <TableCell>{document.iata}</TableCell>
                  <TableCell>{document.skyCode}</TableCell>
                  <TableCell>{document.query}</TableCell>
                  <TableCell>{document.occurances}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  headline: {
    paddingTop: theme.spacing(2),
  },
  table: {
    width: 650,
  },
}));
