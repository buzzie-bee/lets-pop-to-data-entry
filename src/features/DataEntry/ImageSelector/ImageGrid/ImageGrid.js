import { Grid, makeStyles, Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Column } from './Column';

export const ImageGrid = ({
  images,
  colNum,
  incrementPage,
  handleSelect,
  isSelected,
  showOverlay,
  setShowOverlay,
}) => {
  const [columns, setColumns] = useState([]);
  const classes = useStyles();

  const sortColumns = (num) => {
    const tempColumns = [];

    for (let i = 0; i < num; i++) {
      tempColumns.push(images.filter((d, j) => (j + i) % num === 0));
    }
    return tempColumns;
  };

  useEffect(() => {
    setColumns(sortColumns(colNum));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colNum, images]);

  useEffect(() => {
    setTimeout(() => {
      setShowOverlay(true);
    }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!images.length) {
    return <></>;
  }
  return (
    <Paper className={classes.gridContainer}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="space-between"
        spacing={1}
      >
        {columns.map((images, idx) => (
          <Column
            key={`column#${idx}`}
            images={images}
            handleSelect={handleSelect}
            isSelected={isSelected}
          />
        ))}
      </Grid>
      {showOverlay && (
        <div
          className={classes.overlay}
          onClick={() => {
            incrementPage();
          }}
        >
          <div className={classes.overlayContent}>
            <div className={classes.overlayText}>More</div>
          </div>
        </div>
      )}
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    position: 'relative',
    paddingTop: '16px',
    zIndex: 0,
  },
  overlay: {
    cursor: 'pointer',
    position: 'absolute',
    zIndex: 100,
    width: '100%',
    height: '200px',
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginTop: '-150px',
  },
  overlayContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  overlayText: {
    marginTop: '32px',
    fontSize: '3.5em',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    lineHeight: '1em',
    color: 'rgba(255,255,255,0.9)',
    padding: '16px',
    border: '2px solid white',
    userSelect: 'none',
  },
}));
