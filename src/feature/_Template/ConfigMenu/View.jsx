import React, { Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

import Info from '../FeatureInfo';
import { $setTemplate } from '../slice';

const View = React.forwardRef((_props, ref) => {
  const { template } = useSelector((state) => state[Info.ID].storage);
  const dispatch = useDispatch();

  const handler = useCallback(
    (value) => {
      dispatch($setTemplate(value));
    },
    [dispatch],
  );

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List>
          <ListItem onSome={handler}>
            <ListItemText primary={template} />
          </ListItem>
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
