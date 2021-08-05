import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  List,
  ListItem,
  ListItemText,
  Slider,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import ConfigGroup from '../$Config/ConfigGroup';
import useReduxDebounce from '../$Common/ReduxDebounce';

import {
  setFileName,
  setZipName,
  setZipImageName,
  setZipComment,
  setRetryCount,
} from './slice';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxWidth: 'md',
  },
}));

function createMark(value) {
  return { value, label: `${value}회` };
}

const retryMarks = [createMark(1), createMark(2), createMark(3)];

export default function ConfigView() {
  const dispatch = useDispatch();
  const { fileName, zipName, zipImageName, zipComment, retryCount } =
    useSelector((state) => state.ImageDownloader);

  const dispatchFileName = useReduxDebounce((payload) => {
    dispatch(setFileName(payload));
  });
  const dispatchZipName = useReduxDebounce((payload) => {
    dispatch(setZipName(payload));
  });
  const dispatchZipImageName = useReduxDebounce((payload) => {
    dispatch(setZipImageName(payload));
  });
  const dispatchZipComment = useReduxDebounce((payload) => {
    dispatch(setZipComment(payload));
  });

  const handleFileName = useCallback(
    (e) => {
      dispatchFileName(e.target.value);
    },
    [dispatchFileName],
  );

  const handleZipName = useCallback(
    (e) => {
      dispatchZipName(e.target.value);
    },
    [dispatchZipName],
  );

  const handleZipImageName = useCallback(
    (e) => {
      dispatchZipImageName(e.target.value);
    },
    [dispatchZipImageName],
  );

  const handleZipComment = useCallback(
    (e) => {
      dispatchZipComment(e.target.value);
    },
    [dispatchZipComment],
  );

  const handleRetryCount = useCallback(
    (e, value) => {
      dispatch(setRetryCount(value));
    },
    [dispatch],
  );

  const classes = useStyles();

  return (
    <ConfigGroup name="이미지 다운로더">
      <List className={classes.root}>
        <ListItem>
          <ListItemText>우클릭 저장 시 이미지 이름</ListItemText>
        </ListItem>
        <ListItem>
          <TextField
            fullWidth
            defaultValue={fileName}
            onChange={handleFileName}
          />
        </ListItem>
        <ListItem>
          <ListItemText>일괄 다운로드 시 압축파일 이름</ListItemText>
        </ListItem>
        <ListItem>
          <TextField
            fullWidth
            defaultValue={zipName}
            onChange={handleZipName}
          />
        </ListItem>
        <ListItem>
          <ListItemText>일괄 다운로드 시 압축파일 내 이미지 이름</ListItemText>
        </ListItem>
        <ListItem>
          <TextField
            fullWidth
            defaultValue={zipImageName}
            onChange={handleZipImageName}
          />
        </ListItem>
        <ListItem>
          <ListItemText>일괄 다운로드 시 압축파일 코멘트</ListItemText>
        </ListItem>
        <ListItem>
          <TextField
            fullWidth
            variant="outlined"
            multiline
            rows={5}
            defaultValue={zipComment}
            onChange={handleZipComment}
          />
        </ListItem>
        <ListItem>
          <ListItemText>재시도 횟수</ListItemText>
        </ListItem>
        <ListItem>
          <Slider
            marks={retryMarks}
            step={null}
            min={1}
            max={3}
            value={retryCount}
            onChange={handleRetryCount}
          />
        </ListItem>
      </List>
    </ConfigGroup>
  );
}
