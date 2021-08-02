import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Snackbar,
  Switch,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Close, Save } from '@material-ui/icons';

import ConfigGroup from '../$Config/ConfigGroup';
import { setUser, setKeyword, setTestMode } from './slice';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxWidth: 'md',
  },
}));

export default function ConfigView() {
  const classes = useStyles();
  const { users, keywords, testMode } = useSelector(
    (state) => state.ArticleRemover,
  );
  const dispatch = useDispatch();
  const [textUser, setTextUser] = useState(users.join('\n'));
  const [textKeyword, setTextKeyword] = useState(keywords.join('\n'));
  const [errorUser, setErrorUser] = useState(false);
  const [errorKeyword, setErrorKeyword] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleTestMode = (e) => {
    dispatch(setTestMode(e.target.checked));
  };

  const handleUser = (e) => {
    setErrorUser(false);
    setTextUser(e.target.value);
  };

  const handleKeyword = (e) => {
    setErrorKeyword(false);
    setTextKeyword(e.target.value);
  };

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
    <ConfigGroup name="게시물 자동 삭제">
      <List className={classes.root}>
        <ListItem>
          <ListItemText>테스트 모드</ListItemText>
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
        <TextField
          variant="outlined"
          multiline
          fullWidth
          rows={6}
          value={textUser}
          onChange={handleUser}
          error={errorUser}
          helperText={errorUser && '정규식 조건을 위반하는 항목이 있습니다.'}
        />
        <ListItem>
          <ListItemText>검사할 키워드</ListItemText>
          <ListItemSecondaryAction>
            <IconButton onClick={onClickKeyword}>
              <Save />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <TextField
          variant="outlined"
          multiline
          fullWidth
          rows={6}
          value={textKeyword}
          onChange={handleKeyword}
          error={errorKeyword}
          helperText={errorKeyword && '정규식 조건을 위반하는 항목이 있습니다.'}
        />
      </List>
      <Snackbar
        open={showResult}
        autoHideDuration={3000}
        onClose={handleClose}
        message="저장되었습니다."
        action={
          <IconButton onClick={handleClose}>
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </ConfigGroup>
  );
}
