import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Comment } from '@material-ui/icons';

import { USER_INFO } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';
import { getUserID } from 'func/user';

import { $setMemo } from '../slice';
import Info from '../FeatureInfo';
import MemoInput from './MemoInput';

function ContextMenu({ targetRef }) {
  const dispatch = useDispatch();
  const [open, closeMenu] = useContextMenu({
    method: 'closest',
    selector: USER_INFO,
  });
  const {
    storage: { memo },
  } = useSelector((state) => state[Info.ID]);
  const [openInput, setOpenInput] = useState(false);
  const [data, setData] = useState(undefined);

  useEffect(() => {
    if (!open) {
      setData(undefined);
      return;
    }

    const userInfo = targetRef.current.closest(USER_INFO);
    if (!userInfo) return;

    const id = getUserID(userInfo);
    setData(id);
  }, [open, targetRef]);

  const handleClick = useCallback(() => {
    closeMenu();
    setOpenInput(true);
  }, [closeMenu]);

  const handleInputClose = useCallback(() => {
    setOpenInput(false);
  }, []);

  const handleInputSubmit = useCallback(
    (value) => {
      dispatch($setMemo({ user: data, memo: value }));
    },
    [data, dispatch],
  );

  if (!data) return null;
  return (
    <List>
      <MenuItem onClick={handleClick}>
        <ListItemIcon>
          <Comment />
        </ListItemIcon>
        <Typography>메모</Typography>
      </MenuItem>
      <MemoInput
        open={openInput}
        defaultValue={memo[data]}
        onClose={handleInputClose}
        onSubmit={handleInputSubmit}
      />
    </List>
  );
}

export default ContextMenu;
