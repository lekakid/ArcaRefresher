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
import { $toggleEnabled } from '../slice';

const View = React.forwardRef((_props, ref) => {
  const { enabled } = useSelector((state) => state[Info.ID].storage);
  const dispatch = useDispatch();

  const handleEnabled = useCallback(() => {
    dispatch($toggleEnabled());
  }, [dispatch]);

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List>
          <ListItem button onClick={handleEnabled}>
            <ListItemText primary="사용" />
            <ListItemSecondaryAction>
              <Switch onClick={handleEnabled} checked={enabled} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
