import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Switch,
  Typography,
} from '@material-ui/core';

import Info from '../FeatureInfo';
import {
  $toggleAnimation,
  $setTimeLimit,
  $setMaxTime,
  $toggleRefreshOnArticle,
} from '../slice';

const View = React.forwardRef((_props, ref) => {
  const { countdown, maxTime, refreshOnArticle, showProgress } = useSelector(
    (state) => state[Info.ID].storage,
  );
  const dispatch = useDispatch();

  const handleRefreshTime = useCallback(
    (e) => {
      dispatch($setTimeLimit(e.target.value));
    },
    [dispatch],
  );

  const handleMaxTime = useCallback(
    (e) => {
      dispatch($setMaxTime(e.target.value));
    },
    [dispatch],
  );

  const handleRefreshOnArticle = useCallback(() => {
    dispatch($toggleRefreshOnArticle());
  }, [dispatch]);

  const handleAnimation = useCallback(() => {
    dispatch($toggleAnimation());
  }, [dispatch]);

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <ListItem divider>
            <ListItemText>갱신 시간 설정</ListItemText>
            <ListItemSecondaryAction>
              <Select
                variant="outlined"
                value={countdown}
                onChange={handleRefreshTime}
              >
                <MenuItem value={0}>사용 안 함</MenuItem>
                <MenuItem value={5}>5초</MenuItem>
                <MenuItem value={10}>10초</MenuItem>
                <MenuItem value={20}>20초</MenuItem>
                <MenuItem value={30}>30초</MenuItem>
                <MenuItem value={60}>1분</MenuItem>
              </Select>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="최대 갱신 스킵 시간"
              secondary="이 시간만큼 게시물 갱신이 없으면 반드시 새로고침합니다."
            />
            <ListItemSecondaryAction>
              <Select
                variant="outlined"
                value={maxTime}
                onChange={handleMaxTime}
              >
                <MenuItem value={-1}>사용 안 함</MenuItem>
                <MenuItem value={60}>1분</MenuItem>
                <MenuItem value={120}>2분</MenuItem>
                <MenuItem value={300}>5분</MenuItem>
                <MenuItem value={600}>10분</MenuItem>
              </Select>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={handleRefreshOnArticle}>
            <ListItemText
              primary="게시물 조회 중에도 갱신"
              secondary="단, 1페이지를 확실히 보장할 수 있을 때만 동작합니다."
            />
            <ListItemSecondaryAction>
              <Switch
                checked={refreshOnArticle}
                onClick={handleRefreshOnArticle}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button onClick={handleAnimation}>
            <ListItemText>갱신 애니메이션 표시</ListItemText>
            <ListItemSecondaryAction>
              <Switch checked={showProgress} onClick={handleAnimation} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
