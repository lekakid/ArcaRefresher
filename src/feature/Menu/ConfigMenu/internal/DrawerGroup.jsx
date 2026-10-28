import { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

function DrawerGroup({
  groupKey,
  groupIcon,
  groupText,
  open,
  children,
  onClick,
}) {
  const handleClick = useCallback(() => {
    onClick(groupKey);
  }, [groupKey, onClick]);

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton selected={open} onClick={handleClick}>
          <ListItemIcon>{groupIcon}</ListItemIcon>
          <ListItemText>{groupText}</ListItemText>
        </ListItemButton>
      </ListItem>
      <Collapse in={open}>
        <List disablePadding>{children}</List>
      </Collapse>
    </>
  );
}

DrawerGroup.propTypes = {
  groupKey: PropTypes.string,
  groupIcon: PropTypes.element,
  groupText: PropTypes.string,
  open: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

export default DrawerGroup;
