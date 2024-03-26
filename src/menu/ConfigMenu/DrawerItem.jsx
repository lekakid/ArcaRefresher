import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from '@mui/material';

import { setSelection, setDrawer } from './slice';

function DrawerItem({ sx, divider, configKey, icon, children }) {
  const dispatch = useDispatch();
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const handleClick = useCallback(() => {
    dispatch(setSelection(configKey));
    if (mobile) dispatch(setDrawer(false));
  }, [configKey, dispatch, mobile]);

  return (
    <ListItem disablePadding divider={divider}>
      <ListItemButton sx={sx} onClick={handleClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{children}</ListItemText>
      </ListItemButton>
    </ListItem>
  );
}

DrawerItem.propTypes = {
  sx: PropTypes.object,
  divider: PropTypes.bool,
  configKey: PropTypes.string,
  icon: PropTypes.element,
  children: PropTypes.node,
};

export default DrawerItem;
