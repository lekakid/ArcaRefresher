import React from 'react';
import { useSelector } from 'react-redux';
import { List, Paper, Typography, Box, MenuItem } from '@material-ui/core';

import { SelectRow, SwitchRow } from 'component/config';

import Info from '../FeatureInfo';
import {
  $toggleEnable,
  $setDownloadMethod,
  $setFileName,
  $setZipName,
  $setZipImageName,
  $setZipExtension,
} from '../slice';
import { FORMAT_STRING, LABEL } from '../func/format';
import FormatTextFieldRow from './FormatTextFieldRow';

const View = React.forwardRef((_props, ref) => {
  const {
    enabled,
    downloadMethod,
    fileName,
    zipName,
    zipExtension,
    zipImageName,
  } = useSelector((state) => state[Info.ID].storage);

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="사용"
            value={enabled}
            action={$toggleEnable}
          />
          <SelectRow
            divider
            primary="다운로드 방식"
            value={downloadMethod}
            action={$setDownloadMethod}
          >
            <MenuItem value="fetch">fetch</MenuItem>
            <MenuItem value="xhr+fetch">XHR+fetch</MenuItem>
            <MenuItem value="xhr">XHR</MenuItem>
          </SelectRow>
          <FormatTextFieldRow
            divider
            primary="우클릭 저장 시 이미지 이름"
            value={fileName}
            action={$setFileName}
          >
            <MenuItem value={FORMAT_STRING.CHANNEL}>{LABEL.CHANNEL}</MenuItem>
            <MenuItem value={FORMAT_STRING.CHANNEL_ID}>
              {LABEL.CHANNEL_ID}
            </MenuItem>
            <MenuItem value={FORMAT_STRING.TITLE}>{LABEL.TITLE}</MenuItem>
            <MenuItem value={FORMAT_STRING.CATEGORY}>{LABEL.CATEGORY}</MenuItem>
            <MenuItem value={FORMAT_STRING.AUTHOR}>{LABEL.AUTHOR}</MenuItem>
            <MenuItem value={FORMAT_STRING.ARTICLE_ID}>
              {LABEL.ARTICLE_ID}
            </MenuItem>
            <MenuItem value={FORMAT_STRING.URL}>{LABEL.URL}</MenuItem>
            <MenuItem value={FORMAT_STRING.UPLOAD_NAME}>
              {LABEL.UPLOAD_NAME}
            </MenuItem>
          </FormatTextFieldRow>
          <FormatTextFieldRow
            divider
            primary="일괄 다운로드 시 압축파일 이름"
            value={zipName}
            action={$setZipName}
          >
            <MenuItem value={FORMAT_STRING.CHANNEL}>{LABEL.CHANNEL}</MenuItem>
            <MenuItem value={FORMAT_STRING.CHANNEL_ID}>
              {LABEL.CHANNEL_ID}
            </MenuItem>
            <MenuItem value={FORMAT_STRING.TITLE}>{LABEL.TITLE}</MenuItem>
            <MenuItem value={FORMAT_STRING.CATEGORY}>{LABEL.CATEGORY}</MenuItem>
            <MenuItem value={FORMAT_STRING.AUTHOR}>{LABEL.AUTHOR}</MenuItem>
            <MenuItem value={FORMAT_STRING.ARTICLE_ID}>
              {LABEL.ARTICLE_ID}
            </MenuItem>
            <MenuItem value={FORMAT_STRING.URL}>{LABEL.URL}</MenuItem>
          </FormatTextFieldRow>
          <SelectRow
            divider
            primary="일괄 다운로드 시 압축파일 확장자"
            value={zipExtension}
            action={$setZipExtension}
          >
            <MenuItem value="zip">zip</MenuItem>
            <MenuItem value="cbz">cbz</MenuItem>
          </SelectRow>
          <FormatTextFieldRow
            primary="일괄 다운로드 시 압축파일 내 이미지 이름"
            value={zipImageName}
            action={$setZipImageName}
          >
            <MenuItem value={FORMAT_STRING.CHANNEL}>{LABEL.CHANNEL}</MenuItem>
            <MenuItem value={FORMAT_STRING.CHANNEL_ID}>
              {LABEL.CHANNEL_ID}
            </MenuItem>
            <MenuItem value={FORMAT_STRING.TITLE}>{LABEL.TITLE}</MenuItem>
            <MenuItem value={FORMAT_STRING.CATEGORY}>{LABEL.CATEGORY}</MenuItem>
            <MenuItem value={FORMAT_STRING.AUTHOR}>{LABEL.AUTHOR}</MenuItem>
            <MenuItem value={FORMAT_STRING.ARTICLE_ID}>
              {LABEL.ARTICLE_ID}
            </MenuItem>
            <MenuItem value={FORMAT_STRING.URL}>{LABEL.URL}</MenuItem>
            <MenuItem value={FORMAT_STRING.UPLOAD_NAME}>
              {LABEL.UPLOAD_NAME}
            </MenuItem>
            <MenuItem value={FORMAT_STRING.NUMBER}>{LABEL.NUMBER}</MenuItem>
          </FormatTextFieldRow>
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
