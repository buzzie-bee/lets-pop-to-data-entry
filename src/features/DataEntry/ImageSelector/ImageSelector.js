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
  TextField,
  Typography,
} from '@material-ui/core';
import { ImageGrid } from './ImageGrid/ImageGrid';
import { fetchImages } from './fetchHelpers/fetchImages';
import { saveImageDataToFirestore } from './firestoreHelpers/saveImageDataToFirestore';
import { setAsPendingInFirestore } from './firestoreHelpers/setAsPendingInFirestore';

export const ImageSelector = () => {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [searchType, setSearchType] = useState('interestingness-desc');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [dialogueOpen, setDialogOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const { searchQuery } = useParams();
  const [tweakedSearch, setTweakedSearch] = useState(searchQuery);
  const classes = useStyles();
  const history = useHistory();

  // Cleanup images
  useEffect(() => {
    const ids = [];

    const filteredDuplicates = images.filter((img) => {
      if (!ids.includes(img.id)) {
        ids.push(img.id);
        return true;
      }
      return false;
    });
    if (images.length === filteredDuplicates.length) {
      return;
    }
    const imgWithFlickrUrl = filteredDuplicates.map((img) => {
      if (img) {
        if ('owner' in img) {
          if ('id' in img) {
            const { id, owner } = img;
            const flickrUrl = `https://www.flickr.com/photos/${owner}/${id}`;
            img.flickrUrl = flickrUrl;
          }
        }
      }
      return img;
    });
    setImages(imgWithFlickrUrl);
  }, [images]);

  useEffect(() => {
    fetchImages({
      images,
      page,
      searchQuery: tweakedSearch,
      setImages,
      setTotalResults,
      searchType,
      setLoading,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, page]);

  useEffect(() => {
    setAsPendingInFirestore({ searchQuery });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const resetOverlay = () => {
    setShowOverlay(false);
    setTimeout(() => {
      setShowOverlay(true);
    }, 5000);
  };

  const switchSearchType = () => {
    if (searchType === 'interestingness-desc') {
      setSearchType('relevance');
    } else {
      setSearchType('interestingness-desc');
    }
    cleanupState();
  };

  const cleanupState = () => {
    setImages([]);
    setSelectedImages([]);
    setLoading(true);
    setPage(0);
    setTotalResults(0);
    setDialogOpen(false);
    resetOverlay();
    setTimeout(() => {
      setPage(1);
    }, 1000);
  };

  const searchTweakedQuery = () => {
    cleanupState();
  };

  const handleSubmit = ({ notFound }) => {
    saveImageDataToFirestore({
      saveNotFoundValue: notFound,
      searchQuery,
      selectedImages,
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
            <div style={{ marginTop: '16px' }}>
              <Typography variant="body1" display="inline">
                Search Type{' '}
              </Typography>
              <Typography variant="h6" display="inline">
                {searchType}
              </Typography>
              <Button
                style={{ marginLeft: '64px' }}
                variant="contained"
                display="inline"
                onClick={() => {
                  switchSearchType();
                }}
              >
                Switch
              </Button>
            </div>
            <div style={{ marginTop: '16px' }}>
              <Typography variant="body1" display="inline">
                Modify Search Query{' '}
              </Typography>
              <TextField
                value={tweakedSearch}
                style={{ marginLeft: '24px' }}
                onKeyPress={(e) => {
                  if (e.code === 'Enter') {
                    searchTweakedQuery();
                  }
                }}
                onChange={(e) => {
                  e.preventDefault();
                  setTweakedSearch(e.target.value);
                }}
              />
              <Button
                style={{ marginLeft: '24px' }}
                variant="contained"
                display="inline"
                onClick={() => {
                  searchTweakedQuery();
                }}
              >
                Search
              </Button>
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
          showOverlay={showOverlay}
          setShowOverlay={setShowOverlay}
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
