import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Comment } from '@material-ui/icons';

import { ContextMenuList } from '~/$ContextMenu';
import { closeContextMenu } from '~/$ContextMenu/slice';
import MemoInput from './MemoInput';

export default function ContextMenu() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleMemoClick = useCallback(() => {
    dispatch(closeContextMenu());
    dispatch(setOpen(true));
  }, [dispatch]);

  const handleDialogClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <ContextMenuList>
        <MenuItem onClick={handleMemoClick}>
          <ListItemIcon>
            <Comment />
          </ListItemIcon>
          <Typography>메모</Typography>
        </MenuItem>
      </ContextMenuList>
      <MemoInput open={open} onClose={handleDialogClose} />
    </>
  );
}
