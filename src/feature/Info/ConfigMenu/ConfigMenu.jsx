import React, { useCallback } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Typography,
  Box,
} from '@material-ui/core';
import { Link as LinkIcon } from '@material-ui/icons';

import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';

const ConfigMenu = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function ConfigMenu(_props, ref) {
    const handleVisitChannel = useCallback(() => {
      window.open('https://arca.live/b/namurefresher');
    }, []);

    const handleVisitGithub = useCallback(() => {
      window.open('https://github.com/lekakid/ArcaRefresher');
    }, []);

    return (
      <Box ref={ref}>
        <Typography variant="subtitle1">{MODULE_NAME}</Typography>
        <Paper>
          <List>
            <ListItem divider>
              <ListItemText primary="버전" />
              <ListItemSecondaryAction>
                <Typography>{GM_info.script.version}</Typography>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem divider button onClick={handleVisitChannel}>
              <ListItemText primary="아카리프레셔 채널 방문 (문의 접수)" />
              <ListItemSecondaryAction>
                <LinkIcon />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem button onClick={handleVisitGithub}>
              <ListItemText primary="Github 방문" />
              <ListItemSecondaryAction>
                <LinkIcon />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>
      </Box>
    );
  },
);

ConfigMenu.displayName = `ConfigMenu(${MODULE_ID})`;
export default ConfigMenu;
