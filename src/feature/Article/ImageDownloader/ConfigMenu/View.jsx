import { forwardRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { List, Paper, Typography, MenuItem } from '@mui/material';

import { SelectRow, SwitchRow } from 'component/ConfigMenu';

import Info from '../FeatureInfo';
import {
  $toggleEnable,
  $toggleContextMenu,
  $setDownloadMethod,
  $toggleStartWithZero,
  $setFileName,
  $setZipName,
  $setZipImageName,
  $setZipExtension,
} from '../slice';
import FormatTextFieldRow from './FormatTextFieldRow';

const View = forwardRef((_props, ref) => {
  const {
    enabled,
    contextMenuEnabled,
    downloadMethod,
    startWithZero,
    fileName,
    zipName,
    zipExtension,
    zipImageName,
  } = useSelector((state) => state[Info.id].storage);

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Typography variant="subtitle2">동작 설정</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="다운로더 사용"
            secondary="사이트에서 제공하는 다운로드 기능을 대체합니다."
            value={enabled}
            action={$toggleEnable}
          />
          <SwitchRow
            divider
            primary="우클릭 메뉴 사용"
            value={contextMenuEnabled}
            action={$toggleContextMenu}
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
        </List>
      </Paper>
      <Typography variant="subtitle2">저장될 이름 설정</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="숫자 0부터 사용"
            secondary="%num% 변수 사용 시 0부터 카운트 됩니다"
            value={startWithZero}
            action={$toggleStartWithZero}
          />
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
