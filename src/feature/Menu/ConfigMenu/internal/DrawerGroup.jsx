import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import { setGroup } from '../slice';

function DrawerGroup({ groupKey, groupIcon, groupText, open, children }) {
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(setGroup(groupKey));
  }, [dispatch, groupKey]);

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
};

export default DrawerGroup;
