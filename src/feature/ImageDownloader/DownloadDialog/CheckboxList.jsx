import React, { useCallback } from 'react';
import {
  Box,
  Checkbox,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  itemBar: {
    background: 'none',
  },
  checkbox: {
    background: 'rgba(255, 255, 255, 0.5) !important',
  },
}));

export default function CheckboxList({ imgList, selection, onChange }) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleSelect = useCallback(
    (index) => () => {
      const next = selection.includes(index)
        ? selection.filter((s) => s !== index)
        : [...selection, index];
      onChange(next);
    },
    [onChange, selection],
  );

  const classes = useStyles();
  if (imgList.length === 0) {
    return (
      <Box
        display="flex"
        minHeight={200}
        justifyContent="center"
        alignItems="center"
      >
        <Typography>이 게시물에는 이미지가 없습니다.</Typography>
      </Box>
    );
  }
  return (
    <ImageList cols={mobile ? 3 : 6}>
      {imgList.map((img, index) => (
        <ImageListItem key={img}>
          <img src={img} alt={img} />
          <ImageListItemBar
            className={classes.itemBar}
            position="top"
            actionPosition="left"
            actionIcon={
              <Checkbox
                size="small"
                className={classes.checkbox}
                checked={selection.includes(index)}
                onClick={handleSelect(index)}
              />
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
