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
import { toggleAnimation, setTimeLimit } from '../slice';

const View = React.forwardRef((_props, ref) => {
  const {
    config: { countdown, showProgress },
  } = useSelector((state) => state[Info.ID]);
  const dispatch = useDispatch();

  const handleRefreshTime = useCallback(
    (e) => {
      dispatch(setTimeLimit(e.target.value));
    },
    [dispatch],
  );

  const handleAnimation = useCallback(() => {
    dispatch(toggleAnimation());
  }, [dispatch]);

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List>
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
