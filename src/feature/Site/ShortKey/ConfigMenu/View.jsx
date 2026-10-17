import { forwardRef, Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { createSelector } from '@reduxjs/toolkit';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

import { KeyIcon } from 'component';
import { SwitchRow } from 'component/ConfigMenu';

import {
  $setKey,
  $resetKey,
  $resetKeyMap,
  $toggleCompatibilityMode,
  $toggleEnabled,
} from '../slice';
import actionTable from '../actionTable';
import keyFilter from '../keyFilter';
import info from '../info';

function KeyRow({ divider, inputKey, children, onClick }) {
  return (
    <ListItem
      disablePadding
      divider={divider}
      secondaryAction={<KeyIcon title={inputKey} />}
    >
      <ListItemButton onClick={onClick}>
        <ListItemText>{children}</ListItemText>
      </ListItemButton>
    </ListItem>
  );
}

KeyRow.propTypes = {
  divider: PropTypes.bool,
  inputKey: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

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
    .replace('ArrowLeft', '←')
    .replace('ArrowRight', '→')
    .replace('DISABLED', '비활성화');
}

const keyMapSelector = createSelector(
  (state) => state[info.id].storage.keyTable,
  (keyTable) =>
    Object.fromEntries(keyTable.map(({ action, key }) => [action, key])),
);

const View = forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const { enabled, compatibilityMode } = useSelector(
    (state) => state[info.id].storage,
  );
  const keyMap = useSelector(keyMapSelector);
  const [shortKeyAction, setShortKeyAction] = useState(undefined);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    if (!shortKeyAction) return undefined;

    const keyInputEvent = (e) => {
      e.stopPropagation();

      if (e.code === 'Escape') {
        setShortKeyAction(undefined);
        return;
      }

      if (e.code === 'Backspace') {
        dispatch($resetKey({ action: shortKeyAction }));
        setShortKeyAction(undefined);
        return;
      }

      if (e.code === 'Delete') {
        dispatch($setKey({ action: shortKeyAction, key: 'DISABLED' }));
        setShortKeyAction(undefined);
        return;
      }

      if (keyFilter.test(e.code)) {
        setError('이 키는 사용할 수 없습니다.');
        return;
      }

      dispatch($setKey({ action: shortKeyAction, key: e.code }));
      setShortKeyAction(undefined);
      setError(undefined);
    };
    document.addEventListener('keyup', keyInputEvent, true);
    return () => document.removeEventListener('keyup', keyInputEvent, true);
  }, [shortKeyAction, dispatch]);

  const handleReset = () => {
    dispatch($resetKeyMap());
  };

  const handleClick = (action) => () => {
    setShortKeyAction(action);
  };

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{info.name}</Typography>
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
                ⚠️이 옵션을 사용하면 키가 같지 않은 아카라이브 단축키가 동시에
                동작할 수 있습니다.
                <br />키 입력을 사용하는 다른 스크립트를 쓰려면 켜주세요.
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
          <ListItem
            secondaryAction={
              <Tooltip title="초기화">
                <IconButton onClick={handleReset} size="large">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            }
          >
            <ListItemText>단축키 목록</ListItemText>
          </ListItem>
          <ListItem>
            <Paper variant="outlined" sx={{ width: '100%' }}>
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
          </ListItem>
        </List>
      </Paper>
      <Dialog open={!!shortKeyAction}>
        <DialogTitle>키 입력 대기 중...</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography>
              키를 2개 이상 사용하는 단축키는 지원하지 않습니다
            </Typography>
            <Typography>Delete 키를 누르면 기능을 비활성화 합니다</Typography>
            <Typography>
              Backspace 키를 누르면 기본값으로 초기화됩니다
            </Typography>
            <Typography>ESC 키를 눌러 키 변경을 취소합니다</Typography>
            {error && <Typography>{`🚫 ${error}`}</Typography>}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${info.id})`;
export default View;
