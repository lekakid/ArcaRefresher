import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Switch,
  Typography,
  MenuItem,
  Select,
} from '@material-ui/core';

import Info from '../FeatureInfo';
import { $setContextRange, $toggleIdVisible } from '../slice';

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const { showId, contextRange } = useSelector(
    (state) => state[Info.ID].storage,
  );

  const handleContextRange = useCallback(
    (e) => {
      dispatch($setContextRange(e.target.value));
    },
    [dispatch],
  );

  const handleVisible = useCallback(() => {
    dispatch($toggleIdVisible());
  }, [dispatch]);

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List>
          <ListItem divider>
            <ListItemText>게시판 내 우클릭 동작 범위</ListItemText>
            <ListItemSecondaryAction>
              <Select
                variant="outlined"
                value={contextRange}
                onChange={handleContextRange}
              >
                <MenuItem value="articleItem">게시글</MenuItem>
                <MenuItem value="nickname">닉네임</MenuItem>
              </Select>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button onClick={handleVisible}>
            <ListItemText
              primary="반고닉 이용자 고유아이디 표시"
              secondary="로그인 상태에서 정상동작합니다"
            />
            <ListItemSecondaryAction>
              <Switch checked={showId} onChange={handleVisible} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
