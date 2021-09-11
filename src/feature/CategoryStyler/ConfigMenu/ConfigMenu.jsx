import React, { useLayoutEffect, useState } from 'react';
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';

import { useElementQuery } from 'core/hooks';
import { BOARD_LOADED } from 'core/selector';
import { getCategory } from 'util/parser';

import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';
import CategoryRow from './CategoryRow';

function ConfigMenu() {
  const boardLoaded = useElementQuery(BOARD_LOADED);
  const [nameMap, setNameMap] = useState({});

  useLayoutEffect(() => {
    if (!boardLoaded) return;
    setNameMap(getCategory());
  }, [boardLoaded]);

  return (
    <>
      <Typography variant="subtitle1">{MODULE_NAME}</Typography>
      <Paper>
        <List>
          <ListItem>
            <ListItemText>색상 설정</ListItemText>
          </ListItem>
          <ListItem>
            <Paper variant="outlined">
              <Grid container>
                {Object.keys(nameMap).map((id, index) => (
                  <CategoryRow
                    key={id}
                    divider={index !== 0}
                    category={id}
                    nameMap={nameMap}
                  />
                ))}
              </Grid>
            </Paper>
          </ListItem>
        </List>
      </Paper>
    </>
  );
}

ConfigMenu.displayName = `ConfigMenu(${MODULE_ID})`;
export default ConfigMenu;
