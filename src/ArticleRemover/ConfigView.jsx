import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core';
import { Close, Save } from '@material-ui/icons';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import { setUser, setKeyword, setTestMode } from './slice';

export default function ConfigView() {
  const { users, keywords, testMode } = useSelector(
    (state) => state[MODULE_ID],
  );
  const dispatch = useDispatch();
  const [textUser, setTextUser] = useState(users.join('\n'));
  const [textKeyword, setTextKeyword] = useState(keywords.join('\n'));
  const [errorUser, setErrorUser] = useState(false);
  const [errorKeyword, setErrorKeyword] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleTestMode = useCallback(() => {
    dispatch(setTestMode());
  }, [dispatch]);

  const handleUser = useCallback((e) => {
    setErrorUser(false);
    setTextUser(e.target.value);
  }, []);

  const handleKeyword = useCallback((e) => {
    setErrorKeyword(false);
    setTextKeyword(e.target.value);
  }, []);

  const onClickUser = useCallback(() => {
    try {
      const test = textUser.split('\n').filter((i) => i !== '');
      RegExp(test);
      dispatch(setUser(test));
      setShowResult(true);
    } catch (error) {
      console.error(error);
      setErrorUser(true);
    }
  }, [dispatch, textUser]);

  const onClickKeyword = useCallback(() => {
    try {
      const test = textKeyword.split('\n').filter((i) => i !== '');
      RegExp(test);
      dispatch(setKeyword(test));
      setShowResult(true);
    } catch (error) {
      console.error(error);
      setErrorKeyword(true);
    }
  }, [dispatch, textKeyword]);

  const handleClose = () => {
    setShowResult(false);
  };

  return (
    <>
      <Typography variant="subtitle1">{MODULE_NAME}</Typography>
      <Paper>
        <List>
          <ListItem divider button onClick={handleTestMode}>
            <ListItemText
              primary="테스트 모드"
              secondary="삭제를 진행하지 않고 예상 게시물을 보여줍니다."
            />
            <ListItemSecondaryAction>
              <Switch checked={testMode} onChange={handleTestMode} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText>검사할 닉네임</ListItemText>
            <ListItemSecondaryAction>
              <IconButton onClick={onClickUser}>
                <Save />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider>
            <TextField
              variant="outlined"
              multiline
              fullWidth
              rows={6}
              value={textUser}
              onChange={handleUser}
              error={errorUser}
              helperText={
                errorUser && '정규식 조건을 위반하는 항목이 있습니다.'
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText>검사할 키워드</ListItemText>
            <ListItemSecondaryAction>
              <IconButton onClick={onClickKeyword}>
                <Save />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <TextField
              variant="outlined"
              multiline
              fullWidth
              rows={6}
              value={textKeyword}
              onChange={handleKeyword}
              error={errorKeyword}
              helperText={
                errorKeyword && '정규식 조건을 위반하는 항목이 있습니다.'
              }
            />
          </ListItem>
        </List>
        <Snackbar
          open={showResult}
          autoHideDuration={3000}
          onClose={handleClose}
          message="저장했습니다."
          action={
            <IconButton onClick={handleClose}>
              <Close fontSize="small" />
            </IconButton>
          }
        />
      </Paper>
    </>
  );
}
