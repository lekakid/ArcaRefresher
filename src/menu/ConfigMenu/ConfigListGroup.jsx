import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { MODULE_ID } from './ModuleInfo';
import { setGroup } from './slice';

export default function ConfigListGroup({
  groupKey,
  groupIcon,
  groupText,
  children,
}) {
  const dispatch = useDispatch();
  const { group } = useSelector((state) => state[MODULE_ID]);

  const handleClick = useCallback(() => {
    dispatch(setGroup(groupKey));
  }, [dispatch, groupKey]);

  return (
    <>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>{groupIcon}</ListItemIcon>
        <ListItemText>{groupText}</ListItemText>
      </ListItem>
      <Collapse in={group === groupKey}>
        <List disablePadding>{children}</List>
      </Collapse>
    </>
  );
}
