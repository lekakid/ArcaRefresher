import { useCallback, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';

import { AuthorTag, TwitterPicker } from 'component';

import Info from './FeatureInfo';
import { $setMemo, setInputUser } from './slice';
import { ArcaUser } from 'func/user';

function MemoInput() {
  const dispatch = useDispatch();
  const { memo, variant } = useSelector((state) => state[Info.id].storage);

  const user = useSelector((state) => state[Info.id].inputUser);
  const userMemo = memo[user?.id];

  const [msg, setMsg] = useState(null);
  const [color, setColor] = useState(null);

  const handleMsgChange = useCallback((e) => {
    setMsg(e.target.value);
  }, []);

  const handleColorChange = useCallback((input) => {
    setColor(input);
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

      dispatch(
        $setMemo({
          user: user.id,
          memo: {
            ...userMemo,
            msg: msg ? msg : userMemo.msg,
            color: color ? color : userMemo.color,
          },
        }),
      );
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
        <Typography>
          <span
            style={{
              color: color ? color : userMemo?.color,
              fontSize: '.83rem',
              fontWeight: color ? 'bold' : undefined,
            }}
          >
            <span style={{ marginRight: '.2rem' }}>{user?.nick}</span>
            <span
              style={{ color: 'var(--color-user-icon-fixed)' }}
              className={`${user?.type === ArcaUser.TYPE_FIXED ? 'bi-check-circle-fill' : ''} 
              ${user?.type === ArcaUser.TYPE_HALF ? 'bi-person-fill' : ''}`}
            />
            <AuthorTag variant={variant}>{msg ?? userMemo?.msg}</AuthorTag>
          </span>
        </Typography>
        <TextField
          autoFocus
          fullWidth
          size="small"
          margin="normal"
          label="메세지"
          value={msg ?? userMemo?.msg ?? ''}
          onChange={handleMsgChange}
          onKeyDown={handleSubmit}
        />
        <TwitterPicker
          triangle="hide"
          color={color ?? userMemo?.color ?? ''}
          onChange={handleColorChange}
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
