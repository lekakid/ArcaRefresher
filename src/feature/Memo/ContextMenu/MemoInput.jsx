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
} from '@material-ui/core';
import { Close, FormatColorReset } from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';

import { TwitterPicker } from 'react-color';

const styles = (theme) => ({
  closeButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
});

function MemoDialog({ classes, open, onClose, onSubmit, defaultValue }) {
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
    <Dialog maxWidth="xs" open={open} onClose={handleDialogClose}>
      <DialogTitle disableTypography>
        <Typography variant="h6">메모 작성</Typography>
        <IconButton className={classes.closeButton} onClick={handleDialogClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>저장할 메모를 작성해주세요</Typography>
        <TextField
          autoFocus
          fullWidth
          size="small"
          variant="outlined"
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
        <Button variant="outlined" onClick={() => setColor('')}>
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
export default withStyles(styles)(MemoDialog);
