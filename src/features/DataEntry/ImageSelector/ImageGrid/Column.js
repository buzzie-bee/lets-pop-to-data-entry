import { Grid, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { Image } from './Image';

export const Column = ({ images, colNum, handleSelect, isSelected }) => {
  const classes = useStyles();
  return (
    <>
      <Grid
        container
        item
        direction="column"
        justify="flex-start"
        spacing={1}
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
          const imageClass = clsx(classes.image, {
            [classes.isSelected]: isSelected(img),
          });
          return (
            <Grid
              item
              onClick={() => {
                handleSelect(img);
              }}
            >
              <div className={classes.imageContainer}>
                <Image imgClass={imageClass} key={`${url}`} img={img} />
              </div>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  image: {
    width: '100%',
    objectFit: 'cover',
  },
  imageContainer: {
    borderRadius: '8px',
    position: 'relative',
    display: 'inline-block',
    width: '100%',
  },
  isSelected: {
    border: '3px solid red',
    boxShadow: '0px 1px 0px 1px',
    borderRadius: '8px',
  },
}));
