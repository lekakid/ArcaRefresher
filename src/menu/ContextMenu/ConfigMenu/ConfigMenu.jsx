import React, { useCallback } from 'react';
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

import { toggleEnable } from '../slice';
import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';

function ConfigMenu() {
  const {
    config: { enabled },
  } = useSelector((state) => state[MODULE_ID]);
  const dispatch = useDispatch();

  const handleEnable = useCallback(() => {
    dispatch(toggleEnable());
  }, [dispatch]);

  return (
    <>
      <Typography variant="subtitle1">{MODULE_NAME}</Typography>
      <Paper>
        <List>
          <ListItem button onClick={handleEnable}>
            <ListItemText>사용</ListItemText>
            <ListItemSecondaryAction>
              <Switch checked={enabled} onClick={handleEnable} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </>
  );
}

ConfigMenu.displayName = `ConfigMenu(${MODULE_ID})`;
export default ConfigMenu;
