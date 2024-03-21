import React, { Fragment, useCallback, useRef } from 'react';
import { List, ListItemText, Paper, Typography } from '@mui/material';
import { Launch } from '@mui/icons-material';
import streamSaver from 'streamsaver';

import { importValues, exportValues, resetValues } from 'core/storage';
import { BaseRow } from 'component/ConfigMenu';
import { useConfirm } from 'component';

import Info from '../FeatureInfo';

const View = React.forwardRef((_props, ref) => {
  const inputRef = useRef();
  const [confirm, ConfirmDialog] = useConfirm();

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
