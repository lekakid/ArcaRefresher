import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Block, Redo } from '@material-ui/icons';

import { MODULE_ID as CONTEXT_MODULE_ID } from '../$ContextMenu/ModuleInfo';
import ContextMenuList from '../$ContextMenu/ContextMenuList';
import { closeContextMenu } from '../$ContextMenu/slice';

import { CONTEXT_USER_MUTE, MODULE_ID } from './ModuleInfo';
import { addUser, removeUser } from './slice';

function makeRegex(id) {
  return `${id.replace('.', '\\.')}$`;
}

export default function BoardContextMenu() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state[CONTEXT_MODULE_ID]);
  const { user: userList } = useSelector((state) => state[MODULE_ID]);

  const user = makeRegex(data[CONTEXT_USER_MUTE].id);
  const exist = userList.indexOf(user) > -1;

  const handleMute = useCallback(() => {
    dispatch(exist ? removeUser(user) : addUser(user));
    dispatch(closeContextMenu());
  }, [dispatch, exist, user]);

  return (
    <ContextMenuList>
      <MenuItem onClick={handleMute}>
        <ListItemIcon>{exist ? <Redo /> : <Block />}</ListItemIcon>
        <Typography>{exist ? '사용자 뮤트 해제' : '사용자 뮤트'}</Typography>
      </MenuItem>
    </ContextMenuList>
  );
}
