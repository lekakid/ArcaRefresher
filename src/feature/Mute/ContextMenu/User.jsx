import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Block, Redo } from '@material-ui/icons';

import { USER_INFO } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';
import { getUserInfo } from 'func/user';

import Info from '../FeatureInfo';
import { $addUser, $removeUser } from '../slice';

function makeRegex(id = '') {
  return `${id.replace('.', '\\.')}$`;
}

function User({ triggerList }) {
  const dispatch = useDispatch();
  const [setOpen] = useContextMenu();
  const {
    storage: { user },
  } = useSelector((state) => state[Info.ID]);
  const data = useRef(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const trigger = (target) => {
      if (!target.closest(USER_INFO)) {
        data.current = null;
        setValid(false);
        return false;
      }

      data.current = getUserInfo(target.closest(USER_INFO));
      setValid(true);
      return true;
    };

    triggerList.current.push(trigger);
  }, [triggerList]);

  const regex = makeRegex(data.current || '');
  const exist = user.indexOf(regex) > -1;

  const handleMute = useCallback(() => {
    dispatch(exist ? $removeUser(regex) : $addUser(regex));
    setOpen(false);
  }, [dispatch, exist, regex, setOpen]);

  if (!valid) return null;
  return (
    <List>
      <MenuItem onClick={handleMute}>
        <ListItemIcon>{exist ? <Redo /> : <Block />}</ListItemIcon>
        <Typography>{exist ? '사용자 뮤트 해제' : '사용자 뮤트'}</Typography>
      </MenuItem>
    </List>
  );
}

export default User;
