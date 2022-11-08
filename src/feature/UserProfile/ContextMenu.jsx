import React, { useCallback, useEffect, useState } from 'react';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Person } from '@material-ui/icons';

import { USER_INFO } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';
import { getUserInfo } from 'func/user';

function ContextMenu({ targetRef }) {
  const [open, closeMenu] = useContextMenu({
    method: 'closest',
    selector: USER_INFO,
  });
  const [data, setData] = useState(undefined);

  useEffect(() => {
    if (!open) {
      setData(undefined);
      return;
    }

    const userInfo = targetRef.current.closest(USER_INFO);
    if (!userInfo) return;

    const id = getUserInfo(userInfo);
    if (id.includes('.')) {
      // 유동
      setData(undefined);
      return;
    }

    setData(id.replace('#', '/'));
  }, [open, targetRef]);

  const handleInfo = useCallback(() => {
    window.open(`https://arca.live/u/@${data}`);
    closeMenu();
  }, [closeMenu, data]);

  if (!data) return null;
  return (
    <List>
      <MenuItem onClick={handleInfo}>
        <ListItemIcon>
          <Person />
        </ListItemIcon>
        <Typography>사용자 정보</Typography>
      </MenuItem>
    </List>
  );
}

export default ContextMenu;
