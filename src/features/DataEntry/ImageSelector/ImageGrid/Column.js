import { Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { Image } from './Image';

export const Column = ({ images, colNum }) => {
  const classes = useStyles();
  return (
    <>
      <Grid
        container
        item
        direction="column"
        justify="flex-start"
        spacing={2}
        style={{ width: '500px', marginRight: '16px' }}
      >
        {images.map((img, idx) => {
          if (!img) {
            return <></>;
          }
          if (!('imageData' in img)) {
            return <></>;
          }
          if (!('url' in img.imageData)) {
            return <></>;
          }

          const url = img.imageData.url;
          console.log(classes);
          return (
            <div className={classes.imageContainer}>
              <Image imgClass={classes.image} key={`${url}`} img={img} />
            </div>
          );
        })}
      </Grid>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  image: {
    borderRadius: '8px',
    width: '100%',
    objectFit: 'cover',
  },
  imageContainer: {
    position: 'relative',
    display: 'inline-block',
    width: '100%',
  },
}));
