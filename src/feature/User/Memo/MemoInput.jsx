import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Popover,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormatColorResetIcon from '@mui/icons-material/FormatColorReset';
import InfoIcon from '@mui/icons-material/Info';

import { AuthorTag, TwitterPicker } from 'component';
import { ArcaUser } from 'func/user';

import info from './info';
import { $setMemo, setInputUser } from './slice';

function MemoInput() {
  const dispatch = useDispatch();
  const { memo, variant } = useSelector((state) => state[info.id].storage);

  const user = useSelector((state) => state[info.id].inputUser);
  const userMemo = memo[user?.id];

  const [msg, setMsg] = useState(null);
  const [color, setColor] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

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
            msg: msg ?? userMemo?.msg ?? '',
            color: color ?? userMemo?.color ?? '',
          },
        }),
      );
      dispatch(setInputUser(null));
      setMsg(null);
      setColor(null);
    },
    [user, userMemo, msg, color, dispatch],
  );

  const isAccountUser =
    user?.type === ArcaUser.TYPE_FIXED || user?.type === ArcaUser.TYPE_HALF;

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
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography>저장할 메모를 작성해주세요</Typography>
          {isAccountUser && (
            <IconButton onClick={(e) => setAnchorEl(e.target)}>
              <InfoIcon />
            </IconButton>
          )}
        </Stack>
        <Popover
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={!!anchorEl}
          onClose={() => setAnchorEl(null)}
        >
          {user?.type === ArcaUser.TYPE_FIXED && (
            <Alert severity="warning">
              해당 이용자가 닉네임을 바꿀 경우 메모가 따라가지 않습니다. <br />
              다른 사람이 같은 닉네임을 취할 경우 메모가 다른 사람에게 붙을 수
              있습니다.
            </Alert>
          )}
          {user?.type === ArcaUser.TYPE_HALF && (
            <Alert severity="warning">
              고정 닉네임으로 바꿀 경우 메모가 따라가지 않습니다. <br />
              반고닉으로 돌아오면 반고닉 때의 메모가 다시 따라 붙습니다.
            </Alert>
          )}
        </Popover>
        <Typography>
          <span
            style={{
              color: color ?? userMemo?.color,
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
          <FormatColorResetIcon />
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MemoInput;
