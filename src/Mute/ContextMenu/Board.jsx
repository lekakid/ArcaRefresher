import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Block, Redo } from '@material-ui/icons';

import { ContextMenuList, useContextMenuData } from '~/$ContextMenu';
import { closeContextMenu } from '~/$ContextMenu/slice';

import { MODULE_ID } from '../ModuleInfo';
import { addUser, removeUser } from '../slice';

import { USER_MUTE } from './id';

function makeRegex(id) {
  return `${id.replace('.', '\\.')}$`;
}

export default function Board() {
  const dispatch = useDispatch();
  const data = useContextMenuData(USER_MUTE);
  const { user } = useSelector((state) => state[MODULE_ID]);

  const regex = makeRegex(data?.id || '');
  const exist = user.indexOf(regex) > -1;

  const handleMute = useCallback(() => {
    dispatch(exist ? removeUser(regex) : addUser(regex));
    dispatch(closeContextMenu());
  }, [dispatch, exist, regex]);

  return (
    <ContextMenuList>
      <MenuItem onClick={handleMute}>
        <ListItemIcon>{exist ? <Redo /> : <Block />}</ListItemIcon>
        <Typography>{exist ? '사용자 뮤트 해제' : '사용자 뮤트'}</Typography>
      </MenuItem>
    </ContextMenuList>
  );
}
