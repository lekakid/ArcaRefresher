import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Comment } from '@material-ui/icons';

import ContextMenuGroup from '../$ContextMenu/ContextMenuGroup';
import { setContextOpen } from '../$ContextMenu/slice';
import { setOpenDialog } from './slice';

export default function ContextMenu() {
  const dispatch = useDispatch();

  const handleMemo = useCallback(() => {
    dispatch(setContextOpen(false));
    dispatch(setOpenDialog(true));
  }, [dispatch]);

  return (
    <ContextMenuGroup>
      <MenuItem onClick={handleMemo}>
        <ListItemIcon>
          <Comment />
        </ListItemIcon>
        <Typography>메모</Typography>
      </MenuItem>
    </ContextMenuGroup>
  );
}
