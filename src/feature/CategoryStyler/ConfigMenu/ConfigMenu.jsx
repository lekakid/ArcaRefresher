import React from 'react';
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useParser } from 'util/Parser';

import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';
import CategoryRow from './CategoryRow';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

const ConfigMenu = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function ConfigMenu(_props, ref) {
    const { category } = useParser();
    const classes = useStyles();

    return (
      <Box ref={ref}>
        <Typography variant="subtitle1">{MODULE_NAME}</Typography>
        <Paper>
          <List>
            <ListItem>
              <ListItemText>색상 설정</ListItemText>
            </ListItem>
            <ListItem>
              <Paper className={classes.root} variant="outlined">
                <Grid container>
                  {category &&
                    Object.keys(category).map((id, index) => (
                      <CategoryRow
                        key={id}
                        divider={index !== 0}
                        category={id}
                        nameMap={category}
                      />
                    ))}
                </Grid>
              </Paper>
            </ListItem>
          </List>
        </Paper>
      </Box>
    );
  },
);

ConfigMenu.displayName = `ConfigMenu(${MODULE_ID})`;
export default ConfigMenu;
