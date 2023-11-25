import React, { Fragment, useCallback, useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { Launch } from '@mui/icons-material';
import streamSaver from 'streamsaver';

import { importValues, exportValues, resetValues } from 'core/storage';
import { BaseRow } from 'component/ConfigMenu';
import Info from '../FeatureInfo';

const View = React.forwardRef((_props, ref) => {
  const inputRef = useRef();
  const [resetConfirm, setResetConfirm] = useState(false);

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

  const handleOpen = useCallback(() => {
    setResetConfirm(true);
  }, []);

  const handleReset = useCallback(() => {
    resetValues();
    window.location.reload();
  }, []);

  const handleCancle = useCallback(() => {
    setResetConfirm(false);
  }, []);

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <BaseRow divider onRowClick={handleImport}>
            <input
              ref={inputRef}
              type="file"
              accept="text/plain"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <ListItemText
              primary="설정 가져오기"
              secondary="⚠ 페이지가 새로고침됩니다."
            />
            <Launch />
          </BaseRow>
          <BaseRow divider onRowClick={handleExport}>
            <ListItemText primary="설정 내보내기" />
            <Launch />
          </BaseRow>
          <BaseRow divider onRowClick={handleOpen}>
            <ListItemText primary="설정 초기화" />
            <Launch />
          </BaseRow>
        </List>
      </Paper>
      <Dialog open={resetConfirm}>
        <DialogTitle>초기화 재확인</DialogTitle>
        <DialogContent>
          <DialogContentText>
            확인을 누르면 모든 설정이 초기화됩니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleReset}>
            확인
          </Button>
          <Button onClick={handleCancle}>취소</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
