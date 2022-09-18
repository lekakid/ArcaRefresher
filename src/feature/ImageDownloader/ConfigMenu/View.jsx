import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  TextField,
  Typography,
  Switch,
  Box,
} from '@material-ui/core';

import Info from '../FeatureInfo';
import {
  toggleEnable,
  setFileName,
  setZipName,
  setZipImageName,
  setZipComment,
} from '../slice';
import { FORMAT, LABEL } from '../format';
import FormatSelector from './FormatSelector';

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const { enabled, fileName, zipName, zipImageName, zipComment } = useSelector(
    (state) => state[Info.ID],
  );

  const handleEnable = useCallback(() => {
    dispatch(toggleEnable());
  }, [dispatch]);

  const handleFileName = useCallback(
    (e) => {
      dispatch(setFileName(e.target.value));
    },
    [dispatch],
  );
  const handleAddFormatFileName = useCallback(
    (value) => {
      dispatch(setFileName(`${fileName}${value}`));
    },
    [dispatch, fileName],
  );

  const handleZipName = useCallback(
    (e) => {
      dispatch(setZipName(e.target.value));
    },
    [dispatch],
  );
  const handleAddFormatZipName = useCallback(
    (value) => {
      dispatch(setZipName(`${zipName}${value}`));
    },
    [dispatch, zipName],
  );

  const handleZipImageName = useCallback(
    (e) => {
      dispatch(setZipImageName(e.target.value));
    },
    [dispatch],
  );
  const handleAddFormatZipImageName = useCallback(
    (value) => {
      dispatch(setZipImageName(`${zipImageName}${value}`));
    },
    [dispatch, zipImageName],
  );

  const handleZipComment = useCallback(
    (e) => {
      dispatch(setZipComment(e.target.value));
    },
    [dispatch],
  );
  const handleAddFormatZipComment = useCallback(
    (value) => {
      dispatch(setZipComment(`${zipComment}${value}`));
    },
    [dispatch, zipComment],
  );

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List>
          <ListItem divider button onClick={handleEnable}>
            <ListItemText primary="사용" />
            <ListItemSecondaryAction>
              <Switch checked={enabled} onClick={handleEnable} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="우클릭 저장 시 이미지 이름" />
          </ListItem>
          <ListItem divider>
            <TextField fullWidth value={fileName} onChange={handleFileName} />
            <ListItemSecondaryAction>
              <FormatSelector
                formatList={[
                  { value: FORMAT.CHANNEL, label: LABEL.CHANNEL },
                  { value: FORMAT.CHANNEL_ID, label: LABEL.CHANNEL_ID },
                  { value: FORMAT.TITLE, label: LABEL.TITLE },
                  { value: FORMAT.CATEGORY, label: LABEL.CATEGORY },
                  { value: FORMAT.AUTHOR, label: LABEL.AUTHOR },
                  { value: FORMAT.ARTICLE_ID, label: LABEL.ARTICLE_ID },
                  { value: FORMAT.URL, label: LABEL.URL },
                  { value: FORMAT.UPLOAD_NAME, label: LABEL.UPLOAD_NAME },
                ]}
                onSelect={handleAddFormatFileName}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="일괄 다운로드 시 압축파일 이름" />
          </ListItem>
          <ListItem divider>
            <TextField fullWidth value={zipName} onChange={handleZipName} />
            <ListItemSecondaryAction>
              <FormatSelector
                formatList={[
                  { value: FORMAT.CHANNEL, label: LABEL.CHANNEL },
                  { value: FORMAT.CHANNEL_ID, label: LABEL.CHANNEL_ID },
                  { value: FORMAT.TITLE, label: LABEL.TITLE },
                  { value: FORMAT.CATEGORY, label: LABEL.CATEGORY },
                  { value: FORMAT.AUTHOR, label: LABEL.AUTHOR },
                  { value: FORMAT.ARTICLE_ID, label: LABEL.ARTICLE_ID },
                  { value: FORMAT.URL, label: LABEL.URL },
                ]}
                onSelect={handleAddFormatZipName}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="일괄 다운로드 시 압축파일 내 이미지 이름" />
          </ListItem>
          <ListItem divider>
            <TextField
              fullWidth
              value={zipImageName}
              onChange={handleZipImageName}
            />
            <ListItemSecondaryAction>
              <FormatSelector
                formatList={[
                  { value: FORMAT.CHANNEL, label: LABEL.CHANNEL },
                  { value: FORMAT.CHANNEL_ID, label: LABEL.CHANNEL_ID },
                  { value: FORMAT.TITLE, label: LABEL.TITLE },
                  { value: FORMAT.CATEGORY, label: LABEL.CATEGORY },
                  { value: FORMAT.AUTHOR, label: LABEL.AUTHOR },
                  { value: FORMAT.ARTICLE_ID, label: LABEL.ARTICLE_ID },
                  { value: FORMAT.URL, label: LABEL.URL },
                  { value: FORMAT.UPLOAD_NAME, label: LABEL.UPLOAD_NAME },
                  { value: FORMAT.NUMBER, label: LABEL.NUMBER },
                ]}
                onSelect={handleAddFormatZipImageName}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="일괄 다운로드 시 압축파일 코멘트" />
          </ListItem>
          <ListItem divider>
            <TextField
              fullWidth
              variant="outlined"
              multiline
              rows={5}
              value={zipComment}
              onChange={handleZipComment}
            />
            <ListItemSecondaryAction>
              <FormatSelector
                formatList={[
                  { value: FORMAT.CHANNEL, label: LABEL.CHANNEL },
                  { value: FORMAT.CHANNEL_ID, label: LABEL.CHANNEL_ID },
                  { value: FORMAT.TITLE, label: LABEL.TITLE },
                  { value: FORMAT.CATEGORY, label: LABEL.CATEGORY },
                  { value: FORMAT.AUTHOR, label: LABEL.AUTHOR },
                  { value: FORMAT.ARTICLE_ID, label: LABEL.ARTICLE_ID },
                  { value: FORMAT.URL, label: LABEL.URL },
                ]}
                onSelect={handleAddFormatZipComment}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
