import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@material-ui/core';

export default function MemoDialog({
  open,
  onClose,
  onSubmit,
  defaultValue = '',
}) {
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!open) return;
    setInput(defaultValue);
  }, [defaultValue, open]);

  const handleChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const handleDialogClose = useCallback(
    (e, reason) => {
      if (reason === 'backdropClick') return;

      onClose();
    },
    [onClose],
  );

  const handleSubmit = useCallback(
    (e) => {
      if (e.key && e.key !== 'Enter') return;

      onSubmit(input);
      onClose();
    },
    [input, onClose, onSubmit],
  );

  return (
    <Dialog open={open} onClose={handleDialogClose}>
      <DialogTitle>이용자 메모</DialogTitle>
      <DialogContent>
        <Typography>저장할 메모를 작성해주세요</Typography>
        <TextField
          value={input}
          onChange={handleChange}
          onKeyPress={handleSubmit}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>{input ? '저장' : '삭제'}</Button>
        <Button onClick={onClose}>취소</Button>
      </DialogActions>
    </Dialog>
  );
}
