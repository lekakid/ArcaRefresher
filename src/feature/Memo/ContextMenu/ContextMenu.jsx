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
  const [data, setData] = useState(undefined);
  const [target, setTarget] = useState(undefined);

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
    setTarget(data);
    closeMenu();
  }, [closeMenu, data]);

  const handleInputClose = useCallback(() => {
    setTarget(undefined);
  }, []);

  const handleInputSubmit = useCallback(
    (value) => {
      dispatch($setMemo({ user: target, memo: value }));
    },
    [target, dispatch],
  );

  return (
    <>
      {data && (
        <List>
          <MenuItem onClick={handleClick}>
            <ListItemIcon>
              <Comment />
            </ListItemIcon>
            <Typography>메모</Typography>
          </MenuItem>
        </List>
      )}
      <MemoInput
        open={!!target}
        defaultValue={memo[target] || ''}
        onClose={handleInputClose}
        onSubmit={handleInputSubmit}
      />
    </>
  );
}

export default ContextMenu;
