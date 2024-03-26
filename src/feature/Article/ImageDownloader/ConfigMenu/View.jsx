import { forwardRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { List, Paper, Typography, MenuItem } from '@mui/material';

import { SelectRow, SwitchRow } from 'component/ConfigMenu';

import Info from '../FeatureInfo';
import {
  $toggleEnable,
  $setDownloadMethod,
  $setFileName,
  $setZipName,
  $setZipImageName,
  $setZipExtension,
} from '../slice';
import FormatTextFieldRow from './FormatTextFieldRow';

const View = forwardRef((_props, ref) => {
  const {
    enabled,
    downloadMethod,
    fileName,
    zipName,
    zipExtension,
    zipImageName,
  } = useSelector((state) => state[Info.id].storage);

  return (
    <Fragment ref={ref}>
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
            selectableList={[
              'CHANNEL',
              'CHANNEL_ID',
              'TITLE',
              'CATEGORY',
              'AUTHOR',
              'ARTICLE_ID',
              'DATE',
              'TIME',
              'URL',
              'ORIG',
            ]}
            value={fileName}
            action={$setFileName}
          />
          <FormatTextFieldRow
            divider
            primary="일괄 다운로드 시 압축파일 이름"
            selectableList={[
              'CHANNEL',
              'CHANNEL_ID',
              'TITLE',
              'CATEGORY',
              'AUTHOR',
              'ARTICLE_ID',
              'DATE',
              'TIME',
              'URL',
            ]}
            value={zipName}
            action={$setZipName}
          />
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
            selectableList={[
              'CHANNEL',
              'CHANNEL_ID',
              'TITLE',
              'CATEGORY',
              'AUTHOR',
              'ARTICLE_ID',
              'DATE',
              'TIME',
              'URL',
              'ORIG',
              'NUMBER',
            ]}
            value={zipImageName}
            action={$setZipImageName}
          />
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.id})`;
export default View;
