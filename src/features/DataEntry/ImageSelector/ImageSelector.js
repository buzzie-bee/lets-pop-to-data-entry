import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CircularProgress,
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import { stringify } from 'query-string';

export const ImageSelector = () => {
  const [images, setImages] = useState([]);
  const [imagesColA, setImagesColA] = useState([]);
  const [imagesColB, setImagesColB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const { searchQuery } = useParams();
  const classes = useStyles();

  const fetchImages = async () => {
    setLoading(true);
    try {
      const url = 'https://api.pexels.com/v1/search';
      const params = {
        query: searchQuery,
        locale: 'en-US',
        per_page: 20,
        page: page,
      };
      const paramString = stringify(params);
      const headers = {
        Authorization: process.env.REACT_APP_PEXEL_KEY,
      };
      const response = await fetch(`${url}?${paramString}`, { headers });
      const imagesResponse = await response.json();
      if (imagesResponse) {
        if (imagesResponse.photos) {
          if (imagesResponse.photos.length) {
            const colA = imagesResponse.photos.filter(
              (img, ind) => ind % 2 === 0
            );
            const colB = imagesResponse.photos.filter(
              (img, ind) => ind % 2 !== 0
            );
            setImages([...images, ...imagesResponse.photos]);
            setImagesColA([...imagesColA, ...colA]);
            setImagesColB([...imagesColB, ...colB]);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log('loaded & Query =>', searchQuery);
    fetchImages();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" className={classes.headline}>
          Select Images
        </Typography>
        <span>
          <Typography variant="overline" display="inline">
            For{' '}
          </Typography>
          <Typography variant="h6" display="inline">
            {searchQuery}
          </Typography>
        </span>
        <div>
          <CircularProgress />
        </div>
      </Container>
    );
  }
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" className={classes.headline}>
        Select Images
      </Typography>
      <span>
        <Typography variant="overline" display="inline">
          For{' '}
        </Typography>
        <Typography variant="h6" display="inline">
          {searchQuery}
        </Typography>
      </span>
      <Paper>
        <Grid container direction="row" justify="center" spacing={1}>
          <Grid
            container
            item
            direction="column"
            justify="flex-start"
            spacing={1}
            style={{ width: '500px', marginRight: '16px' }}
          >
            {imagesColA.map((img, idx) => {
              const testUrl = `${
                img.src.tiny.split('?')[0]
              }?auto=compress&cs=tinysrgb&w=500`;
              return (
                <Grid
                  item
                  onClick={() => {
                    console.log(`${img.id} clicked`);
                  }}
                >
                  <img src={testUrl} alt="1234" />
                </Grid>
              );
            })}
          </Grid>
          <Grid
            container
            item
            direction="column"
            justify="flex-start"
            spacing={1}
            style={{ width: '500px' }}
          >
            {imagesColB.map((img, idx) => {
              const testUrl = `${
                img.src.tiny.split('?')[0]
              }?auto=compress&cs=tinysrgb&w=500`;
              return (
                <Grid item>
                  <img src={testUrl} alt="1234" />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        {/* {images.map((img, idx) => {
          const testUrl = `${
            img.src.tiny.split('?')[0]
          }?auto=compress&cs=tinysrgb&w=500`;
          return (
            <div key={`img#${idx}`}>
              <img src={testUrl} alt="1234" />
            </div>
          );
        })} */}
      </Paper>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  headline: {
    paddingTop: theme.spacing(2),
  },
  for: {
    display: 'inline-block',
  },
  table: {
    width: 650,
  },
}));
