import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from '@mui/material';

import { setSelection, setDrawer } from './slice';

export default function DrawerItem({ sx, configKey, icon, children }) {
  const dispatch = useDispatch();
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const handleClick = useCallback(() => {
    dispatch(setSelection(configKey));
    if (mobile) dispatch(setDrawer(false));
  }, [configKey, dispatch, mobile]);

  return (
    <ListItem disablePadding>
      <ListItemButton sx={sx} onClick={handleClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{children}</ListItemText>
      </ListItemButton>
    </ListItem>
  );
}
