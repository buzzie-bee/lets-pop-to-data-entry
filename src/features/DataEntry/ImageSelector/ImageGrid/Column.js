import { Grid, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { Image } from './Image';

export const Column = ({ images, colNum, handleSelect, isSelected }) => {
  const classes = useStyles();
  const validImages = images.filter((img) => {
    if (!img) {
      return false;
    }
    if (!('imageData' in img)) {
      return false;
    }
    if (!('url' in img.imageData)) {
      return false;
    }
    return true;
  });
  return (
    <Grid
      key={`column#${colNum}`}
      container
      item
      direction="column"
      justify="flex-start"
      spacing={1}
      className={classes.column}
    >
      {validImages.map((img, idx) => {
        const url = img.imageData.url;
        const imageClass = clsx(classes.image, {
          [classes.isSelected]: isSelected(img),
        });
        return (
          <Grid
            key={`${img.id}`}
            item
            className={classes.gridItem}
            onClick={() => {
              handleSelect(img);
            }}
          >
            <div key={`div_for_${img.id}`} className={classes.imageContainer}>
              <Image imgClass={imageClass} key={`${url}`} img={img} />
            </div>
          </Grid>
        );
      })}
      <Grid item />
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  image: {
    width: '100%',
    borderRadius: '8px',
    objectFit: 'cover',
    border: '2px, solid red',
  },
  imageContainer: {
    position: 'relative',
    display: 'inline-flex',
    flexGrow: 1,
    width: '100%',
  },
  isSelected: {
    border: '3px solid red',
    boxShadow: '0px 1px 0px 1px',
    borderRadius: '8px',
  },
  gridItem: {
    display: 'flex',
  },
  column: {
    maxWidth: '500px',
  },
}));
