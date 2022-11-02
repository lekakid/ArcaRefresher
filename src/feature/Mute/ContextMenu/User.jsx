import React, { useCallback, useEffect, useState } from 'react';
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

function User({ targetRef }) {
  const dispatch = useDispatch();
  const [open, closeMenu] = useContextMenu({
    method: 'closest',
    selector: USER_INFO,
  });
  const {
    storage: { user },
  } = useSelector((state) => state[Info.ID]);
  const [data, setData] = useState(undefined);

  useEffect(() => {
    if (!open) {
      setData(undefined);
      return;
    }

    const userInfo = targetRef.current.closest(USER_INFO);
    if (!userInfo) return;

    const regex = makeRegex(getUserInfo(userInfo));
    const exist = user.includes(regex);
    setData({ regex, exist });
  }, [open, targetRef, user]);

  const handleMute = useCallback(() => {
    const { regex, exist } = data;

    dispatch(exist ? $removeUser(regex) : $addUser(regex));
    closeMenu();
  }, [data, dispatch, closeMenu]);

  if (!data) return null;
  return (
    <List>
      <MenuItem onClick={handleMute}>
        <ListItemIcon>{data.exist ? <Redo /> : <Block />}</ListItemIcon>
        <Typography>
          {data.exist ? '사용자 뮤트 해제' : '사용자 뮤트'}
        </Typography>
      </MenuItem>
    </List>
  );
}

export default User;
