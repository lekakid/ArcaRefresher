import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Comment } from '@material-ui/icons';

import { ContextMenuList } from '~/$ContextMenu';
import { closeContextMenu } from '~/$ContextMenu/slice';

import { setOpenDialog } from './slice';

export default function ContextMenu() {
  const dispatch = useDispatch();

  const handleMemo = useCallback(() => {
    dispatch(closeContextMenu());
    dispatch(setOpenDialog(true));
  }, [dispatch]);

  return (
    <ContextMenuList>
      <MenuItem onClick={handleMemo}>
        <ListItemIcon>
          <Comment />
        </ListItemIcon>
        <Typography>메모</Typography>
      </MenuItem>
    </ContextMenuList>
  );
}
