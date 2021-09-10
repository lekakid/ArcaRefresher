import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

import { setSelection } from './slice';

export default function ConfigListButton({ configKey, icon, children }) {
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(setSelection(configKey));
  }, [configKey, dispatch]);

  return (
    <ListItem button onClick={handleClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{children}</ListItemText>
    </ListItem>
  );
}
