import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Switch,
  Typography,
} from '@material-ui/core';

import Info from '../FeatureInfo';
import { $toggleEnabled, $toggleDeletedOnly } from '../slice';

const View = React.forwardRef((_props, ref) => {
  const {
    storage: { enabled, deletedOnly },
  } = useSelector((state) => state[Info.ID]);
  const dispatch = useDispatch();

  const handleEnabled = useCallback(() => {
    dispatch($toggleEnabled());
  }, [dispatch]);

  const handleDeletedOnly = useCallback(() => {
    dispatch($toggleDeletedOnly());
  }, [dispatch]);

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List>
          <ListItem divider button onClick={handleEnabled}>
            <ListItemText primary="사용" />
            <ListItemSecondaryAction>
              <Switch checked={enabled} onChange={handleEnabled} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button onClick={handleDeletedOnly}>
            <ListItemText primary="삭제된 게시물에서만 사용(채널 관리자 전용)" />
            <ListItemSecondaryAction>
              <Switch checked={deletedOnly} onChange={handleDeletedOnly} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
