import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

import info from '../info';
import { $setTemplate } from '../slice';

function View() {
  const { template } = useSelector((state) => state[info.id].storage);
  const dispatch = useDispatch();

  const handler = useCallback(
    (value) => {
      dispatch($setTemplate(value));
    },
    [dispatch],
  );

  return (
    <>
      <Typography variant="subtitle1">{info.name}</Typography>
      <Paper>
        <List>
          <ListItem onSome={handler}>
            <ListItemText primary={template} />
          </ListItem>
        </List>
      </Paper>
    </>
  );
}

View.displayName = `ConfigMenuView(${info.id})`;
export default View;
