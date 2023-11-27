import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { Close, FormatColorReset } from '@mui/icons-material';
import { TwitterPicker } from 'react-color';

function MemoDialog({ open, onClose, onSubmit, defaultValue }) {
  const [msg, setMsg] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    if (!open) return;
    setMsg(defaultValue.msg);
    setColor(defaultValue.color);
  }, [defaultValue, open]);

  const handleMsgChange = useCallback((e) => {
    setMsg(e.target.value);
  }, []);

  const handleColorChange = useCallback((input) => {
    setColor(input.hex);
  }, []);

  const handleDialogClose = useCallback(
    (_e, reason) => {
      if (reason === 'backdropClick') return;

      onClose();
    },
    [onClose],
  );

  const handleSubmit = useCallback(
    (e) => {
      if (e.key && e.key !== 'Enter') return;

      onSubmit({ msg, color });
      onClose();
    },
    [msg, color, onClose, onSubmit],
  );

  return (
    <Dialog sx={{ maxWidth: 'xs' }} open={open} onClose={handleDialogClose}>
      <DialogTitle>메모 작성</DialogTitle>
      <IconButton
        size="large"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
        }}
        onClick={handleDialogClose}
      >
        <Close />
      </IconButton>
      <DialogContent dividers>
        <Typography gutterBottom>저장할 메모를 작성해주세요</Typography>
        <TextField
          autoFocus
          fullWidth
          size="small"
          margin="normal"
          label="메세지"
          value={msg}
          inputProps={{ style: { color } }}
          onChange={handleMsgChange}
          onKeyPress={handleSubmit}
        />
        <TwitterPicker
          triangle="hide"
          color={color}
          onChangeComplete={handleColorChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setColor('')}>
          <FormatColorReset />
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}

MemoDialog.defaultProps = {
  defaultValue: { msg: '', color: '' },
};
export default MemoDialog;
