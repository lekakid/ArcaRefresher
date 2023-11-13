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

import { createSelector } from '@reduxjs/toolkit';
import {
  $resetKeyMap,
  $setKey,
  $toggleCompatibilityMode,
  $toggleEnabled,
  setWaitKeyInput,
} from '../slice';
import actionTable from '../actionTable';
import keyFilter from '../keyFilter';
import Info from '../FeatureInfo';

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

const keyMapSelector = createSelector(
  (state) => state[Info.ID].storage.keyTable,
  (keyTable) =>
    Object.fromEntries(keyTable.map(({ action, key }) => [action, key])),
);

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const { enabled, compatibilityMode } = useSelector(
    (state) => state[Info.ID].storage,
  );
  const keyMap = useSelector(keyMapSelector);
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
          <SwitchRow
            divider
            primary="사용"
            value={enabled}
            action={$toggleEnabled}
          />
          <SwitchRow
            primary="호환성 모드"
            secondary={
              <>
                <Typography variant="body2">
                  ⚠️이 옵션을 사용하면 키가 겹치지 않을 때 아카라이브 단축키가
                  동시에 동작합니다.
                </Typography>
                <Typography variant="body2">
                  키 입력을 사용하는 다른 스크립트를 쓰려면 켜주세요
                </Typography>
                <Typography variant="body2">새로고침이 필요합니다.</Typography>
              </>
            }
            value={compatibilityMode}
            action={$toggleCompatibilityMode}
          />
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
                  {actionTable.map(({ action, label, defaultKey }, index) => (
                    <KeyRow
                      key={action}
                      divider={index !== actionTable.length - 1}
                      inputKey={formatKey(
                        keyMap[action] || defaultKey,
                      ).toUpperCase()}
                      onClick={handleClick(action)}
                    >
                      {label}
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
