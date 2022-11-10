import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import { ColorPicker, createColor } from 'material-ui-color';

export default function InputDialog({
  open,
  onClose,
  onSubmit,
  defaultValue = '',
}) {
  const [input, setInput] = useState(createColor(''));

  useEffect(() => {
    if (!open) return;

    setInput(createColor(defaultValue));
  }, [defaultValue, open]);

  const handleChange = useCallback((colorInfo) => {
    const updatedInput =
      typeof colorInfo === 'string' ? createColor(colorInfo) : colorInfo;
    setInput(updatedInput);
  }, []);

  const handleDialogClose = useCallback(
    (e, reason) => {
      if (reason === 'backdropClick') return;

      onClose();
    },
    [onClose],
  );

  const handleSave = useCallback(() => {
    const cssColor = input.name !== 'none' ? input.css.backgroundColor : null;
    onSubmit(cssColor);
    onClose();
  }, [input, onClose, onSubmit]);

  return (
    <Dialog open={open} onClose={handleDialogClose}>
      <DialogTitle>색상 설정</DialogTitle>
      <DialogContent>
        <Typography>지정할 색상을 선택해주세요</Typography>
        <ColorPicker
          deferred
          disableAlpha
          value={input}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={input.error} onClick={handleSave}>
          저장
        </Button>
        <Button onClick={onClose}>취소</Button>
      </DialogActions>
    </Dialog>
  );
}
