import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Box,
  Checkbox,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
  useMediaQuery,
} from '@material-ui/core';

const useStyles = makeStyles({
  imgList: {
    minHeight: 200,
    maxHeight: 400,
    '& video': {
      top: '50%',
      width: '100%',
      position: 'relative',
      transform: 'translateY(-50%)',
    },
  },
  itemBar: {
    background: 'none',
  },
  checkbox: {
    background: 'rgba(255, 255, 255, 0.5) !important',
  },
});

export default function ImageSelector({ list, selection, onChange }) {
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const classes = useStyles();
  const [innerSelection, setSelection] = useState([]);

  useEffect(() => {
    setSelection([]);
    if (onChange) onChange([]);
  }, [list, onChange]);

  useEffect(() => {
    setSelection(selection);
  }, [selection]);

  const handleCheck = useCallback(
    (index) => () => {
      const update = innerSelection.includes(index)
        ? innerSelection.filter((s) => index !== s)
        : [...innerSelection, index];
      setSelection(update);
      if (onChange) onChange(update);
    },
    [onChange, innerSelection],
  );

  if (!list?.length) {
    return (
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={classes.imgList}
      >
        <Typography>저장된 자짤이 없습니다.</Typography>
      </Box>
    );
  }

  return (
    <ImageList
      cols={mobile ? 3 : 5}
      rowHeight={100}
      className={classes.imgList}
    >
      {list.map((img, index) => (
        <ImageListItem key={img} onClick={handleCheck(index)}>
          {img.indexOf('.mp4') > -1 ? (
            <video src={img} alt={img} autoPlay loop muted />
          ) : (
            <img src={img} alt={img} />
          )}
          <ImageListItemBar
            className={classes.itemBar}
            position="top"
            actionPosition="left"
            actionIcon={
              <Checkbox
                size="small"
                className={classes.checkbox}
                checked={innerSelection.includes(index)}
              />
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
