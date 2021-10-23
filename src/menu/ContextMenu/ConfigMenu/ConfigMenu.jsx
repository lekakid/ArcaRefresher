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

import { KeyIcon } from 'component';

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
          <ListItem divider button onClick={handleEnable}>
            <ListItemText>사용</ListItemText>
            <ListItemSecondaryAction>
              <Switch checked={enabled} onClick={handleEnable} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="컨텍스트 메뉴 특수키" />
          </ListItem>
          <Box clone mx={2} mb={2}>
            <Paper variant="outlined">
              <List disablePadding>
                <ListItem>
                  <ListItemText primary="브라우저 메뉴 표시" />
                  <ListItemSecondaryAction>
                    <Box display="flex" alignItems="center">
                      <KeyIcon title="Shift" />
                      +
                      <KeyIcon title="Click" />
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>
          </Box>
        </List>
      </Paper>
    </>
  );
}

ConfigMenu.displayName = `ConfigMenu(${MODULE_ID})`;
export default ConfigMenu;
