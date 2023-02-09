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
} from '@material-ui/core';

import Info from '../FeatureInfo';
import { $toggleIdVisible } from '../slice';

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const {
    storage: { showId },
  } = useSelector((state) => state[Info.ID]);

  const handleVisible = useCallback(() => {
    dispatch($toggleIdVisible());
  }, [dispatch]);

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List>
          <ListItem button onClick={handleVisible}>
            <ListItemText
              primary="반고닉 이용자 아이디 표시"
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
