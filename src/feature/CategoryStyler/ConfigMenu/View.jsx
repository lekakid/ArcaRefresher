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

import Info from '../FeatureInfo';
import CategoryRow from './CategoryRow';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

const View = React.forwardRef((_props, ref) => {
  const { category } = useParser();
  const classes = useStyles();

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
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
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
