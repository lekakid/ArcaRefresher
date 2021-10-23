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
  Box,
  Divider,
} from '@material-ui/core';

import { KeyIcon } from 'component';

import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';
import { toggleEnabled } from '../slice';

function ConfigMenu() {
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
          <ListItem divider button onClick={handleEnabled}>
            <ListItemText primary="사용" />
            <ListItemSecondaryAction>
              <Switch checked={enabled} onChange={handleEnabled} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="게시판 단축키" />
          </ListItem>
          <Box clone mx={2} mb={2}>
            <Paper variant="outlined">
              <List disablePadding>
                <ListItem divider>
                  <ListItemText primary="개념글 전환" />
                  <ListItemSecondaryAction>
                    <Box display="flex" alignItems="center">
                      <KeyIcon title="E" />
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem divider>
                  <ListItemText primary="글 작성" />
                  <ListItemSecondaryAction>
                    <Box display="flex" alignItems="center">
                      <KeyIcon title="W" />
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem divider>
                  <ListItemText primary="이전 페이지" />
                  <ListItemSecondaryAction>
                    <Box display="flex" alignItems="center">
                      <KeyIcon title="D" />
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText primary="다음 페이지" />
                  <ListItemSecondaryAction>
                    <Box display="flex" alignItems="center">
                      <KeyIcon title="F" />
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>
          </Box>
          <Divider />
          <ListItem>
            <ListItemText primary="게시물 단축키" />
          </ListItem>
          <Box clone mx={2} mb={2}>
            <Paper variant="outlined">
              <List disablePadding>
                <ListItem divider>
                  <ListItemText primary="게시물 추천" />
                  <ListItemSecondaryAction>
                    <Box display="flex" alignItems="center">
                      <KeyIcon title="E" />
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem divider>
                  <ListItemText primary="댓글로 이동" />
                  <ListItemSecondaryAction>
                    <Box display="flex" alignItems="center">
                      <KeyIcon title="R" />
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem divider>
                  <ListItemText primary="댓글 작성칸으로 이동" />
                  <ListItemSecondaryAction>
                    <Box display="flex" alignItems="center">
                      <KeyIcon title="W" />
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText primary="게시판으로 이동" />
                  <ListItemSecondaryAction>
                    <Box display="flex" alignItems="center">
                      <KeyIcon title="A" />
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
