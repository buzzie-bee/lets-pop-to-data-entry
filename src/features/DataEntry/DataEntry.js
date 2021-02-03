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
  const classes = useStyles();

  const fetchNextTenDocuments = async () => {
    const documents = [];

    try {
      const locationsRef = await db.collection('locations');
      const querySnapshot = await locationsRef
        .where('imgUrl', '==', '')
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

  useEffect(() => {
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
      <Typography variant="h6">Next few records:</Typography>
      <TableContainer component={Paper} className={classes.table}>
        <Table className={classes.table} aria-label="table of next locations">
          <TableHead>
            <TableCell>IATA</TableCell>
            <TableCell>SkyCode</TableCell>
            <TableCell>Query</TableCell>
          </TableHead>
          <TableBody>
            {nextFewDocuments.map((document, idx) => {
              return (
                <TableRow key={`tr ${idx}`} component="th" scope="row">
                  <TableCell>{document.iata}</TableCell>
                  <TableCell>{document.skyCode}</TableCell>
                  <TableCell>{document.query}</TableCell>
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
