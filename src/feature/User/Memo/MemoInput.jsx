import { useCallback, useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';

import Info from './FeatureInfo';
import { $setMemo, setInputUser } from './slice';

function MemoInput() {
  const dispatch = useDispatch();
  const { memo } = useSelector((state) => state[Info.id].storage);
  const user = useSelector((state) => state[Info.id].inputUser);
  const userMemo = memo[user];

  const [msg, setMsg] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    if (!user) return;

    setMsg(memo[user]?.msg || '');
    setColor(memo[user]?.color || '');
  }, [memo, user]);

  const handleMsgChange = useCallback((e) => {
    setMsg(e.target.value);
  }, []);

  const handleColorChange = useCallback((input) => {
    setColor(input.hex);
  }, []);

  const handleDialogClose = useCallback(
    (_e, reason) => {
      if (reason === 'backdropClick') return;

      dispatch(setInputUser(null));
    },
    [dispatch],
  );

  const handleSubmit = useCallback(
    (e) => {
      if (e.key && e.key !== 'Enter') return;

      dispatch($setMemo({ user, memo: { ...userMemo, msg, color } }));
      dispatch(setInputUser(null));
    },
    [user, userMemo, msg, color, dispatch],
  );

  return (
    <Dialog sx={{ maxWidth: 'xs' }} open={!!user} onClose={handleDialogClose}>
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
          slotProps={{
            htmlInput: { style: { color } },
          }}
          label="메세지"
          value={msg}
          onChange={handleMsgChange}
          onKeyDown={handleSubmit}
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

export default MemoInput;
