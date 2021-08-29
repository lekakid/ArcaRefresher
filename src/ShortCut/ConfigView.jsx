import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Switch,
  Typography,
} from '@material-ui/core';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import { toggleEnabled } from './slice';

export default function ConfigView() {
  const dispatch = useDispatch();
  const { enabled } = useSelector((state) => state[MODULE_ID]);

  const handleEnabled = useCallback(() => {
    dispatch(toggleEnabled());
  }, [dispatch]);

  return (
    <>
      <Typography variant="subtitle1">{MODULE_NAME}</Typography>
      <Paper>
        <List>
          <ListItem button onClick={handleEnabled}>
            <ListItemText primary="사용" />
            <ListItemSecondaryAction>
              <Switch checked={enabled} onChange={handleEnabled} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </>
  );
}
