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
import { CheckCircle, CheckCircleOutline } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  itemBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  checkbox: {
    color: theme.palette.grey.A100,
  },
}));

export default function ImageSelector({ imgList, selection, onChange }) {
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
    <ImageList cols={mobile ? 3 : 6} rowHeight={mobile ? 100 : 180}>
      {imgList.map((img, index) => (
        <ImageListItem key={img} onClick={handleSelect(index)}>
          <img src={img} alt={img} />
          <ImageListItemBar
            className={classes.itemBar}
            position="top"
            actionPosition="left"
            actionIcon={
              <Checkbox
                size="small"
                color="default"
                classes={{
                  root: classes.checkbox,
                  checked: classes.checkbox,
                }}
                icon={<CheckCircleOutline />}
                checkedIcon={<CheckCircle />}
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
