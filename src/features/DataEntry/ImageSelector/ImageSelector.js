import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import { Waypoint } from 'react-waypoint';
import { stringify } from 'query-string';
import { db } from '../../../firebase/firebase';

export const ImageSelector = () => {
  const [images, setImages] = useState([]);
  const [imagesColA, setImagesColA] = useState([]);
  const [imagesColB, setImagesColB] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeoutPending, setTimeoutPending] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const { searchQuery } = useParams();
  const [dialogueOpen, setDialogOpen] = useState(false);
  let history = useHistory();
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
            setTotalResults(imagesResponse.total_results);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const isSelected = (img) => {
    return selectedImages.filter((sImg) => sImg.id === img.id).length > 0;
  };

  const handleSelect = (img) => {
    if (selectedImages.filter((sImg) => sImg.id === img.id).length) {
      const filtered = selectedImages.filter((sImg) => sImg.id !== img.id);
      setSelectedImages(filtered);
      return;
    }

    const customWidth = `${
      img.src.tiny.split('?')[0]
    }?auto=compress&cs=tinysrgb&w=`;
    img.customWidth = customWidth;
    setSelectedImages([...selectedImages, img]);
  };

  useEffect(() => {
    console.log('loaded & Query =>', searchQuery);
    fetchImages();
    setTimeoutPending(true);
    setTimeout(() => {
      setTimeoutPending(false);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const saveImagesToFirestore = async () => {
    try {
      const locationsRef = db.collection('locations');
      const result = await locationsRef.doc(searchQuery).set(
        {
          images: selectedImages,
          imgUrl: selectedImages[0].customWidth,
        },
        { merge: true }
      );
      if (result === undefined) {
        const snapshot = await locationsRef
          .where('imgUrl', '==', '')
          .limit(1)
          .get();

        snapshot.forEach((doc) => {
          const nextDoc = doc.data();
          history.push(`/entry/${nextDoc.query}`);
          setImages([]);
          setImagesColA([]);
          setImagesColB([]);
          setSelectedImages([]);
          setLoading(true);
          setTimeoutPending(true);
          setTotalResults(0);
          setPage(1);
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const couldNotFindCorrectImages = async () => {
    try {
      const locationsRef = db.collection('locations');
      const result = await locationsRef.doc(searchQuery).set(
        {
          imgUrl: 'NoValidImg',
        },
        { merge: true }
      );
      if (result === undefined) {
        const snapshot = await locationsRef
          .where('imgUrl', '==', '')
          .limit(1)
          .get();

        snapshot.forEach((doc) => {
          const nextDoc = doc.data();
          history.push(`/entry/${nextDoc.query}`);
          setImages([]);
          setImagesColA([]);
          setImagesColB([]);
          setSelectedImages([]);
          setLoading(true);
          setTimeoutPending(true);
          setTotalResults(0);
          setPage(1);
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (loading && !images.length) {
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
      <div style={{ marginTop: '16px' }}>
        <Typography variant="body1" display="inline">
          Found{' '}
        </Typography>
        <Typography variant="h6" display="inline">
          {totalResults}
        </Typography>
        <Typography variant="body1" display="inline">
          {' '}
          Images total
        </Typography>
      </div>
      <div style={{ marginTop: '1em' }}>
        <Typography variant="body1" display="inline">
          Selected{' '}
        </Typography>
        <Typography variant="h6" display="inline">
          {selectedImages.length}
        </Typography>
        <Typography variant="body1" display="inline">
          {' '}
          Images
        </Typography>
      </div>
      <div className={classes.buttonContainer}>
        {/* <div> */}
        <Button
          onClick={() => {
            console.log(selectedImages);
            saveImagesToFirestore();
          }}
          size="large"
          color="primary"
          variant="contained"
          disabled={selectedImages.length === 0}
        >
          Save image selection
        </Button>
        {/* </div>
      <div className={classes.buttonContainer}> */}
        <Button
          onClick={() => {
            setDialogOpen(true);
          }}
          size="large"
          color="secondary"
          variant="contained"
          disabled={selectedImages.length > 0}
        >
          SKIP SEARCH - NO RELEVANT IMAGES
        </Button>
        <Dialog
          open={dialogueOpen}
          onClose={() => {
            setDialogOpen(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Dismiss this search result?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Dismissing this search query now will mean having to find it
              later. Are you sure you can't find a half decent image?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setDialogOpen(false);
              }}
              color="default"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                couldNotFindCorrectImages();
                setDialogOpen(false);
              }}
              color="secondary"
              autoFocus
            >
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div style={{ marginBottom: '4em' }} />
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
              const url = `${
                img.src.tiny.split('?')[0]
              }?auto=compress&cs=tinysrgb&w=500`;
              if (idx === imagesColA.length - 1 && !timeoutPending) {
                return (
                  <Grid
                    item
                    onClick={() => {
                      handleSelect(img);
                    }}
                  >
                    <Waypoint
                      onEnter={() => {
                        setPage(page + 1);
                      }}
                    >
                      <img
                        src={url}
                        alt={`${searchQuery} by ${img.photographer} from Pexels.com`}
                        className={isSelected(img) ? classes.selected : ''}
                      />
                    </Waypoint>
                  </Grid>
                );
              }
              return (
                <Grid
                  item
                  onClick={() => {
                    handleSelect(img);
                  }}
                >
                  <img
                    src={url}
                    alt={`${searchQuery} by ${img.photographer} from Pexels.com`}
                    className={isSelected(img) ? classes.selected : ''}
                  />
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
              const url = `${
                img.src.tiny.split('?')[0]
              }?auto=compress&cs=tinysrgb&w=500`;
              if (idx === imagesColB.length - 1 && !timeoutPending) {
                return (
                  <Grid
                    item
                    onClick={() => {
                      handleSelect(img);
                    }}
                  >
                    <Waypoint
                      onEnter={() => {
                        setPage(page + 1);
                      }}
                    >
                      <img
                        src={url}
                        alt={`${searchQuery} by ${img.photographer} from Pexels.com`}
                        className={isSelected(img) ? classes.selected : ''}
                      />
                    </Waypoint>
                  </Grid>
                );
              }
              return (
                <Grid
                  item
                  onClick={() => {
                    handleSelect(img);
                  }}
                >
                  <img
                    src={url}
                    alt={`${searchQuery} by ${img.photographer} from Pexels.com`}
                    className={isSelected(img) ? classes.selected : ''}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
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
  selected: {
    border: '4px solid red',
    boxShadow: '0px 2px 0px 2px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));
