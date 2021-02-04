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
import { ImageGrid } from './ImageGrid/ImageGrid';
import { fetchImageIds } from './fetchHelpers/fetchImageIds';
import { fetchUnfetchedImages } from './fetchHelpers/fetchUnfetchedImages';
import { saveImageDataToFirestore } from './saveImageDataToFirestore';

export const ImageSelector = () => {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gatheringImages, setGatheringImages] = useState(false);
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

  useEffect(() => {
    setTimeout(() => {
      fetchImageIds({
        images,
        page,
        searchQuery,
        setImages,
        setTotalResults,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleSelect = (img) => {
    if (selectedImages.filter((sImg) => sImg.id === img.id).length) {
      const filtered = selectedImages.filter((sImg) => sImg.id !== img.id);
      setSelectedImages(filtered);
      return;
    }
    setSelectedImages([...selectedImages, img]);
  };

  const isSelected = (img) => {
    return selectedImages.filter((sImg) => sImg.id === img.id).length > 0;
  };

  const handleSubmit = ({ notFound }) => {
    saveImageDataToFirestore({
      saveNotFoundValue: notFound,
      searchQuery,
      selectedImages,
      setImages,
      setSelectedImages,
      setLoading,
      setGatheringImages,
      setPage,
      setTotalResults,
      setDialogOpen,
      history,
    });
  };

  return (
    <div>
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
                  handleSubmit({ notFound: false });
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
                      handleSubmit({ notFound: true });
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
      <div className={classes.imageGrid}>
        <ImageGrid
          images={images}
          colNum={2}
          incrementPage={() => {
            setPage(page + 1);
          }}
          handleSelect={handleSelect}
          isSelected={isSelected}
        />
      </div>
    </div>
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
    padding: '16px',
  },
}));
