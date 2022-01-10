import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Comment } from '@material-ui/icons';

import { USER_INFO } from 'core/selector';
import { setClose } from 'menu/ContextMenu/slice';
import { getUserID } from 'util/user';

import { setMemo } from '../slice';
import { MODULE_ID } from '../ModuleInfo';
import MemoInput from './MemoInput';

function ContextMenu({ triggerList }) {
  const dispatch = useDispatch();
  const { memo } = useSelector((state) => state[MODULE_ID]);
  const [open, setOpen] = useState(false);
  const data = useRef(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const trigger = (target) => {
      if (!target.closest(USER_INFO)) {
        data.current = null;
        setValid(false);
        return false;
      }

      const userInfo = target.closest(USER_INFO);
      const id = getUserID(userInfo);
      data.current = id;
      setValid(true);
      return true;
    };

    triggerList.current.push(trigger);
  }, [triggerList]);

  const handleClick = useCallback(() => {
    dispatch(setClose());
    setOpen(true);
  }, [dispatch]);

  const handleInputClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleInputSubmit = useCallback(
    (value) => {
      dispatch(setMemo({ user: data.current, memo: value }));
    },
    [data, dispatch],
  );

  if (!valid) return null;
  return (
    <List>
      <MenuItem onClick={handleClick}>
        <ListItemIcon>
          <Comment />
        </ListItemIcon>
        <Typography>메모</Typography>
      </MenuItem>
      <MemoInput
        open={open}
        defaultValue={memo[data.current]}
        onClose={handleInputClose}
        onSubmit={handleInputSubmit}
      />
    </List>
  );
}

export default ContextMenu;
