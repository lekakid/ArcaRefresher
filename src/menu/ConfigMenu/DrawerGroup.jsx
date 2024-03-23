import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import { setGroup } from './slice';
import Info from './FeatureInfo';

function DrawerGroup({ groupKey, groupIcon, groupText, open, children }) {
  const dispatch = useDispatch();
  const { group } = useSelector((state) => state[Info.id]);

  const handleClick = useCallback(() => {
    dispatch(setGroup(groupKey));
  }, [dispatch, groupKey]);

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton selected={group === groupKey} onClick={handleClick}>
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
