import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Person } from '@material-ui/icons';

import { USER_INFO } from 'core/selector';
import { setClose } from 'menu/ContextMenu/slice';

// 우클릭 메뉴
function ContextMenu({ triggerList }) {
  const dispatch = useDispatch();
  const data = useRef(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    // 유저 정보 취득 예시
    const trigger = (target) => {
      const userInfo = target.closest(USER_INFO);
      if (!userInfo) {
        data.current = null;
        setValid(false);
        return false;
      }

      const id = userInfo?.querySelector('[data-filter]')?.dataset.filter || '';
      data.current = id.replace('#', '/');
      setValid(/^[^,]+$/.test(id));
      return true;
    };

    triggerList.current.push(trigger);
  }, [triggerList]);

  const handleClick = useCallback(() => {
    // 클릭 시 동작 작성
    dispatch(setClose());
  }, [dispatch]);

  if (!valid) return null;
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
