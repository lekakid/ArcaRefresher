import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
  Switch,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import ConfigGroup from '../$Config/ConfigGroup';
import { setAnimation, setTimeLimit } from './slice';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxWidth: 'md',
  },
}));

export default function ConfigView() {
  const classes = useStyles();
  const { timeLimit, showProgress } = useSelector(
    (state) => state.AutoRefresher,
  );
  const dispatch = useDispatch();

  const handleRefreshTime = useCallback(
    (e) => {
      dispatch(setTimeLimit(e.target.value));
    },
    [dispatch],
  );

  const handleAnimation = useCallback(
    (e) => {
      dispatch(setAnimation(e.target.checked));
    },
    [dispatch],
  );

  return (
    <ConfigGroup name="자동 새로고침">
      <List className={classes.root}>
        <ListItem>
          <ListItemText>갱신 시간 설정</ListItemText>
          <ListItemSecondaryAction>
            <Select value={timeLimit} onChange={handleRefreshTime}>
              <MenuItem value={0}>사용 안 함</MenuItem>
              <MenuItem value={5}>5초</MenuItem>
              <MenuItem value={10}>10초</MenuItem>
              <MenuItem value={20}>20초</MenuItem>
              <MenuItem value={30}>30초</MenuItem>
              <MenuItem value={60}>1분</MenuItem>
            </Select>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText>갱신 애니메이션 표시</ListItemText>
          <ListItemSecondaryAction>
            <Switch checked={showProgress} onChange={handleAnimation} />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </ConfigGroup>
  );
}
