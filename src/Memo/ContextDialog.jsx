import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@material-ui/core';

import { useContextMenuData } from '~/$ContextMenu';

import { MODULE_ID } from './ModuleInfo';
import { setMemo, setOpenDialog } from './slice';

export default function MemoDialog() {
  const dispatch = useDispatch();
  const data = useContextMenuData(MODULE_ID);
  const { open } = useSelector((state) => state[MODULE_ID]);
  const [memoText, setMemoText] = useState('');

  const handleText = useCallback((e) => {
    setMemoText(e.target.value);
  }, []);

  const handleSave = useCallback(() => {
    const { id } = data;
    dispatch(setMemo({ user: id, memo: memoText }));
    dispatch(setOpenDialog(false));
    setMemoText('');
  }, [data, dispatch, memoText]);

  const handleClose = useCallback(() => {
    dispatch(setOpenDialog(false));
    setMemoText('');
  }, [dispatch]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>이용자 메모</DialogTitle>
      <DialogContent>
        <Typography>저장할 메모를 작성해주세요</Typography>
        <TextField value={memoText} onChange={handleText} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave}>{memoText ? '저장' : '삭제'}</Button>
        <Button onClick={handleClose}>취소</Button>
      </DialogActions>
    </Dialog>
  );
}
