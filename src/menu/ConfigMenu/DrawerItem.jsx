import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from '@material-ui/core';

import { setSelection, setDrawer } from './slice';

export default function DrawerItem({ className, configKey, icon, children }) {
  const dispatch = useDispatch();
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleClick = useCallback(() => {
    dispatch(setSelection(configKey));
    if (mobile) dispatch(setDrawer(false));
  }, [configKey, dispatch, mobile]);

  return (
    <ListItem className={className} button onClick={handleClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{children}</ListItemText>
    </ListItem>
  );
}
