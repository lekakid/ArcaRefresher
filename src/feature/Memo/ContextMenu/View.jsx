import React, { useCallback, useState } from 'react';
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
  const {
    storage: { memo },
  } = useSelector((state) => state[Info.ID]);
  const [user, setUser] = useState(undefined);

  const [data, closeMenu] = useContextMenu({
    targetRef,
    selector: USER_INFO,
    dataExtractor: (target) => getUserID(target),
  });

  const handleClick = useCallback(() => {
    setUser(data);
    closeMenu();
  }, [closeMenu, data]);

  const handleInputClose = useCallback(() => {
    setUser(undefined);
  }, []);

  const handleInputSubmit = useCallback(
    (value) => {
      dispatch($setMemo({ user, memo: value }));
    },
    [user, dispatch],
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
        open={!!user}
        defaultValue={memo[user] || ''}
        onClose={handleInputClose}
        onSubmit={handleInputSubmit}
      />
    </>
  );
}

export default ContextMenu;
