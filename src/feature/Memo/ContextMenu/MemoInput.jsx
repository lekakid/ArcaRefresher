import React, { useCallback, useEffect, useState } from 'react';
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

import { useContextMenuData } from 'menu/ContextMenu';
import { MODULE_ID } from '../ModuleInfo';
import { setMemo } from '../slice';

export default function MemoDialog({ open, onClose }) {
  const dispatch = useDispatch();
  const { id = '' } = useContextMenuData(MODULE_ID);
  const { memo } = useSelector((state) => state[MODULE_ID]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!open) return;
    setInput(memo[id] || '');
  }, [id, memo, open]);

  const handleChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const handleSave = useCallback(() => {
    dispatch(setMemo({ user: id, memo: input }));
    onClose();
  }, [dispatch, id, input, onClose]);

  return (
    <Dialog open={open}>
      <DialogTitle>이용자 메모</DialogTitle>
      <DialogContent>
        <Typography>저장할 메모를 작성해주세요</Typography>
        <TextField value={input} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave}>{input ? '저장' : '삭제'}</Button>
        <Button onClick={onClose}>취소</Button>
      </DialogActions>
    </Dialog>
  );
}
