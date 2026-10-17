import { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

function DrawerItem({ sx, divider, icon, children, configKey, onClick }) {
  const handleClick = useCallback(() => {
    onClick(configKey);
  }, [configKey, onClick]);

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
  icon: PropTypes.element,
  children: PropTypes.node,
  configKey: PropTypes.string,
  onClick: PropTypes.func,
};

export default DrawerItem;
