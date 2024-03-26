import { forwardRef, Fragment, useCallback, useRef } from 'react';
import {
  List,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Launch } from '@mui/icons-material';
import streamSaver from 'streamsaver';

import { importValues, exportValues, resetValues } from 'core/storage';
import { BaseRow } from 'component/ConfigMenu';
import { useConfirm } from 'component';

import Info from '../FeatureInfo';

const featureContext = require.context(
  'feature/',
  true,
  /^feature\/(?!_).+\/.+\/FeatureInfo$/,
);

const idList = featureContext
  .keys()
  .map((path) => featureContext(path).default.id);

const View = forwardRef((_props, ref) => {
  const inputRef = useRef();
  const [confirm, ConfirmDialog] = useConfirm();

  const handleCleaner = useCallback(async () => {
    const keys = GM_listValues();
    const uselessKeys = keys.filter((key) => !idList.includes(key));
    const uselessData = uselessKeys.reduce(
      (acc, key) => ({ ...acc, [key]: GM_getValue(key) }),
      {},
    );

    const result = await confirm({
      title: '정리하기 전에...',
      content: (
        <>
          <Typography>다음 데이터들을 삭제합니다.</Typography>
          <Typography variant="caption">
            _v0, _v1 등의 이름을 가진 데이터는 백업데이터로 삭제해도 문제되지
            않습니다.
          </Typography>
          <TextField
            sx={{ my: 2 }}
            fullWidth
            multiline
            minRows={6}
            maxRows={6}
            value={JSON.stringify(uselessData)}
          />
        </>
      ),
    });
    if (!result) return;

    uselessKeys.forEach((key) => GM_deleteValue(key));
  }, [confirm]);

  const handleImport = useCallback(() => {
    inputRef.current.click();
  }, []);

  const handleFileSelect = useCallback((e) => {
    (async () => {
      try {
        const path = e.target.files[0];
        const data = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.readAsText(path);
        });
        importValues(data);

        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleExport = useCallback(() => {
    const data = exportValues();
    const blob = new Blob([data], { type: 'text/plain' });
    const rs = blob.stream();
    const filestream = streamSaver.createWriteStream('setting.txt');
    return rs.pipeTo(filestream);
  }, []);

  const handleReset = useCallback(async () => {
    const result = await confirm({
      title: '초기화 재확인',
      content: '모든 설정을 초기화하시겠습니까?',
    });
    if (!result) return;

    resetValues();
    window.location.reload();
  }, [confirm]);

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Typography variant="subtitle2">데이터 정리</Typography>
      <Paper>
        <List disablePadding>
          <BaseRow
            header={<ListItemText primary="데이터 정리" />}
            onClick={handleCleaner}
          >
            <Launch />
          </BaseRow>
        </List>
      </Paper>
      <Typography variant="subtitle2">설정 관리</Typography>
      <Paper>
        <List disablePadding>
          <BaseRow
            divider
            header={
              <ListItemText
                primary="설정 가져오기"
                secondary="⚠ 페이지가 새로고침됩니다."
              />
            }
            onClick={handleImport}
          >
            <Launch />
            <input
              ref={inputRef}
              type="file"
              accept="text/plain"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </BaseRow>
          <BaseRow
            divider
            header={<ListItemText primary="설정 내보내기" />}
            onClick={handleExport}
          >
            <Launch />
          </BaseRow>
          <BaseRow
            divider
            header={<ListItemText primary="설정 초기화" />}
            onClick={handleReset}
          >
            <Launch />
          </BaseRow>
        </List>
      </Paper>
      <ConfirmDialog />
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.id})`;
export default View;
