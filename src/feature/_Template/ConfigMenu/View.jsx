import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';

import Info from '../FeatureInfo';
import { someReducer } from '../slice';

const View = React.forwardRef((_props, ref) => {
  const {
    config: { template },
  } = useSelector((state) => state[Info.ID]);
  const dispatch = useDispatch();

  const handler = useCallback(
    (value) => {
      dispatch(someReducer(value));
    },
    [dispatch],
  );

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List>
          <ListItem onSome={handler}>
            <ListItemText primary={template} />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;