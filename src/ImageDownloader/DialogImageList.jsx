import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';

import {
  SET_ALL_SELECTION,
  SET_DOWNLOAD,
  SET_SELECTION,
} from './DialogReducer';

const useStyles = makeStyles(() => ({
  itemBar: {
    background: 'none',
  },
  checkbox: {
    background: 'rgba(255, 255, 255, 0.5) !important',
  },
}));

export default function DialogImageList({ state: { data }, dispatch }) {
  const theme = useTheme();
  const classes = useStyles();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedAll, setSelectedAll] = useState(false);

  useEffect(() => {
    if (data.every((d) => d.selected)) setSelectedAll(true);
    else setSelectedAll(false);

    return () => {
      setSelectedAll(false);
    };
  }, [data]);

  const handleSelectImage = useCallback(
    (index) => {
      dispatch({ type: SET_SELECTION, value: index });
    },
    [dispatch],
  );

  const handleSelectAll = useCallback(() => {
    setSelectedAll((prevState) => {
      dispatch({
        type: SET_ALL_SELECTION,
        value: !prevState,
      });

      return !prevState;
    });
  }, [dispatch]);

  const handleDownload = useCallback(() => {
    dispatch({ type: SET_DOWNLOAD });
  }, [dispatch]);

  if (data.length > 0) {
    return (
      <>
        <DialogContent>
          <ImageList cols={mobile ? 2 : 4}>
            {data.map(({ orig, thumb, filename, selected }, index) => (
              <ImageListItem key={orig}>
                <img src={thumb} alt={filename} />
                <ImageListItemBar
                  className={classes.itemBar}
                  position="top"
                  actionPosition="left"
                  actionIcon={
                    <Checkbox
                      size="small"
                      className={classes.checkbox}
                      checked={selected}
                      onClick={() => handleSelectImage(index)}
                    />
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSelectAll}>
            {selectedAll ? '전체 선택 해제' : '전체 선택'}
          </Button>
          <Button onClick={handleDownload}>다운로드</Button>
        </DialogActions>
      </>
    );
  }

  return <Typography>이 게시물에는 첨부된 이미지가 없습니다.</Typography>;
}
