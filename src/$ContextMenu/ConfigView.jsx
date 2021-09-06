import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Switch,
  Typography,
} from '@material-ui/core';

import { setEnable } from './slice';
import { MODULE_ID, MODULE_NAME } from './ModuleInfo';

export default function ConfigView() {
  const { enabled } = useSelector((state) => state[MODULE_ID]);
  const dispatch = useDispatch();

  const handleTestMode = (e) => {
    dispatch(setEnable(e.target.checked));
  };

  return (
    <>
      <Typography variant="subtitle1">{MODULE_NAME}</Typography>
      <Paper>
        <List>
          <ListItem button onClick={handleTestMode}>
            <ListItemText>사용</ListItemText>
            <ListItemSecondaryAction>
              <Switch checked={enabled} onChange={handleTestMode} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </>
  );
}
