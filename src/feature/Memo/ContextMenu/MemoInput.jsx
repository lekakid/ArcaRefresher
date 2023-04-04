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
import { ColorPicker, createColor } from 'material-ui-color';
import { Close } from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';

const styles = (theme) => ({
  closeButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
});

function MemoDialog({ classes, open, onClose, onSubmit, defaultValue }) {
  const [msg, setMsg] = useState('');
  const [color, setColor] = useState(createColor(''));

  useEffect(() => {
    if (!open) return;
    console.log(defaultValue);
    setMsg(defaultValue.msg);
    setColor(createColor(defaultValue.color));
  }, [defaultValue, open]);

  const handleMsgChange = useCallback((e) => {
    setMsg(e.target.value);
  }, []);

  const handleColorChange = useCallback((input) => {
    const updatedInput = typeof input === 'string' ? createColor(input) : input;
    setColor(updatedInput);
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

      const cssColor = color.name !== 'none' ? color.css.backgroundColor : '';
      onSubmit({ msg, color: cssColor });
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
          variant="outlined"
          size="small"
          label="메세지"
          value={msg}
          onChange={handleMsgChange}
          onKeyPress={handleSubmit}
        />
        <ColorPicker disableAlpha value={color} onChange={handleColorChange} />
      </DialogContent>
      <DialogActions>
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
