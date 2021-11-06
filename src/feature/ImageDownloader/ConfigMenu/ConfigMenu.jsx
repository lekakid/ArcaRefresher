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
  Switch,
  Box,
} from '@material-ui/core';

import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';
import {
  toggleEnable,
  setFileName,
  setZipName,
  setZipImageName,
  setZipComment,
  setRetryCount,
} from '../slice';
import { FORMAT, LABEL } from '../format';
import FormatSelector from './FormatSelector';

function createMark(value) {
  return { value, label: `${value}회` };
}

const retryMarks = [createMark(1), createMark(2), createMark(3)];

const ConfigMenu = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function ConfigMenu(_props, ref) {
    const dispatch = useDispatch();
    const { enabled, fileName, zipName, zipImageName, zipComment, retryCount } =
      useSelector((state) => state[MODULE_ID]);

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

    const handleRetryCount = useCallback(
      (e, value) => {
        dispatch(setRetryCount(value));
      },
      [dispatch],
    );

    return (
      <Box ref={ref}>
        <Typography variant="subtitle1">{MODULE_NAME}</Typography>
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
      </Box>
    );
  },
);
ConfigMenu.displayName = `ConfigMenu(${MODULE_ID})`;
export default ConfigMenu;
