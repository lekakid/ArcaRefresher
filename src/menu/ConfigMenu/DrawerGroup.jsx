import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { setGroup } from './slice';

export default function DrawerGroup({
  groupKey,
  groupIcon,
  groupText,
  open,
  children,
}) {
  const dispatch = useDispatch();
  const handleClick = useCallback(() => {
    dispatch(setGroup(groupKey));
  }, [dispatch, groupKey]);

  return (
    <>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>{groupIcon}</ListItemIcon>
        <ListItemText>{groupText}</ListItemText>
      </ListItem>
      <Collapse in={open}>
        <List disablePadding>{children}</List>
      </Collapse>
    </>
  );
}
