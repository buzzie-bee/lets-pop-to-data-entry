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
  makeStyles,
  Typography,
} from '@material-ui/core';
import { stringify } from 'query-string';
import { db } from '../../../firebase/firebase';
import { ImageGrid } from './ImageGrid/ImageGrid';
import { fetchImageIds } from './fetchImageIds';
import { fetchImage } from './fetchImage';
import { fetchUnfetchedImages } from './fetchUnfetchedImages';

export const ImageSelector = () => {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gatheringImages, setGatheringImages] = useState();
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [dialogueOpen, setDialogOpen] = useState(false);
  const { searchQuery } = useParams();
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    fetchImageIds({
      images,
      page,
      searchQuery,
      setImages,
      setTotalResults,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (!gatheringImages) {
      fetchUnfetchedImages({
        setImages,
        images,
        setGatheringImages,
        setLoading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

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
        console.log('need to implement firestore saving');
        // const snapshot = await locationsRef
        //   .where('imgUrl', '==', '')
        //   .limit(1)
        //   .get();

        // snapshot.forEach((doc) => {
        //   const nextDoc = doc.data();
        //   history.push(`/entry/${nextDoc.query}`);
        //   setImages([]);
        //   // setImagesColA([]);
        //   // setImagesColB([]);
        //   setSelectedImages([]);
        //   setLoading(true);
        //   setTotalResults(0);
        //   setPage(1);
        // });
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
          //
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
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
        {loading ? (
          <Loading />
        ) : (
          <>
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
            <div style={{ marginTop: '16px' }}>
              <Typography variant="body1" display="inline">
                Results Page{' '}
              </Typography>
              <Typography variant="h6" display="inline">
                {page}
              </Typography>
            </div>
          </>
        )}
      </Container>
      <Container maxWidth="lg" className={classes.imageGrid}>
        <ImageGrid
          images={images}
          colNum={2}
          incrementPage={() => {
            setPage(page + 1);
          }}
        />
      </Container>
    </>
  );
};

const Loading = () => {
  return (
    <div>
      <CircularProgress />
    </div>
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
    marginTop: '16px',
    marginBottom: '16px',
  },
  imageGrid: {
    marginTop: '16px',
  },
}));
