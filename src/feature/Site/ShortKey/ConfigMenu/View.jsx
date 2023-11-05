import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Refresh } from '@material-ui/icons';

import { SwitchRow } from 'component/config';
import { KeyIcon } from 'component';

import {
  $resetKeyMap,
  $setKey,
  $toggleEnabled,
  setWaitKeyInput,
} from '../slice';
import keyFilter from '../keyFilter';
import Info from '../FeatureInfo';

const ACTION_LABEL = {
  write: '글 작성',
  refresh: '새로고침',
  moveTop: '가장 위로 스크롤',
  prev: '이전 글/게시판 이전 페이지',
  next: '다음 글/게시판 다음 페이지',
  goBoard: '게시물 목록으로 이동',
  goBest: '개념글 페이지 토글',
  comment: '댓글 입력창으로 이동',
  recommend: '게시물 추천',
  scrap: '게시물 스크랩',
};

function KeyRow({ divider, inputKey, children, onClick }) {
  return (
    <ListItem divider={divider} button onClick={onClick}>
      <ListItemText>{children}</ListItemText>
      <ListItemSecondaryAction>
        <KeyIcon title={inputKey} />
      </ListItemSecondaryAction>
    </ListItem>
  );
}

function formatKey(keyStr) {
  return keyStr
    .replace('Key', '')
    .replace('Numpad', 'Num ')
    .replace('Backquote', '`')
    .replace('Backslash', '\\')
    .replace('Add', '+')
    .replace('Subtract', '-')
    .replace('Minus', '-')
    .replace('Divide', '/')
    .replace('Multiply', '*')
    .replace('Equal', '=')
    .replace('Decimal', '.')
    .replace('ArrowUp', '↑')
    .replace('ArrowDown', '↓')
    .replace('ArrowLeft', 'ㅁ')
    .replace('ArrowRight', '→')
    .replace('DISABLED', '비활성화');
}

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const { enabled, keyTable } = useSelector((state) => state[Info.ID].storage);
  const { waitKeyInput } = useSelector((state) => state[Info.ID]);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    if (!waitKeyInput) return undefined;

    const keyInputEvent = (e) => {
      e.stopPropagation();

      if (e.code === 'Escape') {
        dispatch(setWaitKeyInput(undefined));
        return;
      }

      if (e.code === 'Delete') {
        dispatch($setKey({ action: waitKeyInput, key: 'DISABLED' }));
        dispatch(setWaitKeyInput(undefined));
        return;
      }

      if (keyFilter.test(e.code)) {
        setError('이 키는 사용할 수 없습니다.');
        return;
      }

      dispatch($setKey({ action: waitKeyInput, key: e.code }));
      dispatch(setWaitKeyInput(undefined));
      setError(undefined);
    };
    document.addEventListener('keyup', keyInputEvent, true);
    return () => document.removeEventListener('keyup', keyInputEvent, true);
  }, [waitKeyInput, dispatch]);

  const handleReset = () => {
    dispatch($resetKeyMap());
  };

  const handleClick = (action) => () => {
    dispatch(setWaitKeyInput(action));
  };

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow primary="사용" value={enabled} action={$toggleEnabled} />
        </List>
      </Paper>
      <Typography variant="subtitle2">키 설정</Typography>
      <Paper>
        <List disablePadding>
          <ListItem>
            <ListItemText>단축키 목록</ListItemText>
            <ListItemSecondaryAction>
              <Tooltip title="초기화">
                <IconButton onClick={handleReset}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <Box clone width="100%">
              <Paper variant="outlined">
                <List disablePadding>
                  {keyTable.map(({ action, key }, index) => (
                    <KeyRow
                      key={action}
                      divider={index !== keyTable.length - 1}
                      inputKey={formatKey(key).toUpperCase()}
                      onClick={handleClick(action)}
                    >
                      {ACTION_LABEL[action]}
                    </KeyRow>
                  ))}
                </List>
              </Paper>
            </Box>
          </ListItem>
        </List>
      </Paper>
      <Dialog open={!!waitKeyInput}>
        <DialogTitle>키 입력 대기 중...</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography>
              키를 2개 이상 사용하는 단축키는 지원하지 않습니다
            </Typography>
            <Typography>Delete 키를 누르면 기능을 비활성화 합니다</Typography>
            <Typography>ESC 키를 눌러 키 변경을 취소합니다</Typography>
            {error && <Typography>{`🚫 ${error}`}</Typography>}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
