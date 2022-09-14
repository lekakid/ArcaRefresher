import React, { useCallback, useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import { Launch } from '@material-ui/icons';
import { saveAs } from 'file-saver';

import { importValues, exportValues, resetValues } from 'core/storage';
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
    const file = new Blob([data], { type: 'text/plain' });
    saveAs(file, 'settings.txt');
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
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List>
          <ListItem divider button onClick={handleImport}>
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
            <ListItemSecondaryAction>
              <Launch />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={handleExport}>
            <ListItemText primary="설정 내보내기" />
            <ListItemSecondaryAction>
              <Launch />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button onClick={handleOpen}>
            <ListItemText primary="설정 초기화" />
            <ListItemSecondaryAction>
              <Launch />
            </ListItemSecondaryAction>
          </ListItem>
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
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
