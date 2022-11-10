import React, { useCallback } from 'react';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Person } from '@material-ui/icons';

import { USER_INFO } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';

// 우클릭 메뉴
function ContextMenu({ targetRef }) {
  const [data, closeMenu] = useContextMenu({
    targetRef,
    selector: USER_INFO,
    dataExtractor: (target) => target.src.split('?')[0],
  });

  const handleClick = useCallback(() => {
    // 클릭 시 동작 작성
    closeMenu();
  }, [closeMenu]);

  if (!data) return null;
  return (
    <List>
      <MenuItem onClick={handleClick}>
        <ListItemIcon>
          <Person />
        </ListItemIcon>
        <Typography>MENU_NAME</Typography>
      </MenuItem>
    </List>
  );
}

export default ContextMenu;
