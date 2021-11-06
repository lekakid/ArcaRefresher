import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';

export default function PresetNameInput({
  open,
  onSubmit,
  onClose,
  initialValue = '',
}) {
  const [input, setInput] = useState('');

  useEffect(() => {
    if (open) setInput(initialValue);
  }, [initialValue, open]);

  const handleChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit(input);
  }, [input, onSubmit]);

  return (
    <Dialog open={open}>
      <DialogTitle>프리셋 이름 입력</DialogTitle>
      <DialogContent>
        채널 slug로 설정 시 해당 채널에서 항상 사용되는 테마가 됩니다.
        <TextField fullWidth autoFocus value={input} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>확인</Button>
        <Button onClick={onClose}>취소</Button>
      </DialogActions>
    </Dialog>
  );
}
