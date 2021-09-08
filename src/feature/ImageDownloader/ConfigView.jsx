import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Slider,
  TextField,
  Typography,
} from '@material-ui/core';

import { useReduxDebounce } from 'core/hooks';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import {
  setFileName,
  setZipName,
  setZipImageName,
  setZipComment,
  setRetryCount,
} from './slice';

function createMark(value) {
  return { value, label: `${value}회` };
}

const retryMarks = [createMark(1), createMark(2), createMark(3)];

export default function ConfigView() {
  const dispatch = useDispatch();
  const { fileName, zipName, zipImageName, zipComment, retryCount } =
    useSelector((state) => state[MODULE_ID]);

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

  return (
    <>
      <Typography variant="subtitle1">{MODULE_NAME}</Typography>
      <Paper>
        <List>
          <ListItem divider>
            <ListItemText
              primary="우클릭 저장 시 이미지 이름"
              secondary={
                <TextField
                  fullWidth
                  defaultValue={fileName}
                  onChange={handleFileName}
                />
              }
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="일괄 다운로드 시 압축파일 이름"
              secondary={
                <TextField
                  fullWidth
                  defaultValue={zipName}
                  onChange={handleZipName}
                />
              }
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="일괄 다운로드 시 압축파일 내 이미지 이름"
              secondary={
                <TextField
                  fullWidth
                  defaultValue={zipImageName}
                  onChange={handleZipImageName}
                />
              }
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="일괄 다운로드 시 압축파일 코멘트"
              secondary={
                <TextField
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={5}
                  defaultValue={zipComment}
                  onChange={handleZipComment}
                />
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText>재시도 횟수</ListItemText>
            <ListItemSecondaryAction>
              <Slider
                marks={retryMarks}
                step={null}
                min={1}
                max={3}
                value={retryCount}
                onChange={handleRetryCount}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </>
  );
}
