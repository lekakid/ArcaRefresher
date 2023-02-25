import React, { useEffect, useState } from 'react';
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

export default function ImageSelector({ list, selection, disabled, onChange }) {
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const classes = useStyles();
  const [currentList, setCurrentList] = useState();
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    const updateChecked = list.map(() => false);
    selection.forEach((s) => {
      updateChecked[s] = true;
    });
    setChecked(updateChecked);
    setCurrentList(list);
  }, [list, selection]);

  const handleCheck = (index) => () => {
    const update = [...checked];
    update[index] = !update[index];

    setChecked(update);
    if (onChange) {
      const updateSelection = update
        .map((c, i) => (c ? i : -1))
        .filter((i) => i > -1);
      onChange(updateSelection);
    }
  };

  if (list.length === 0) {
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

  if (list !== currentList) return null;
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
              !disabled && (
                <Checkbox
                  size="small"
                  className={classes.checkbox}
                  checked={checked[index]}
                  onChange={handleCheck(index)}
                />
              )
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
