import React, { useCallback, useEffect, useState } from 'react';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Person } from '@material-ui/icons';

import { USER_INFO } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';

// 우클릭 메뉴
function ContextMenu({ targetRef }) {
  // menu/ContextMenu 에서 메뉴를 열지 말지 판단할 용도로 함수(method)와 설렉터를 넘김
  const [open, closeMenu] = useContextMenu({
    method: 'closest',
    selector: USER_INFO,
  });
  const [data, setData] = useState(undefined);

  // 데이터 취득 처리
  useEffect(() => {
    // 오른쪽 클릭 메뉴가 열려있지 않을 경우
    if (!open) {
      setData(undefined);
      return;
    }

    // 취득한 대상이 아닐 경우
    // 대부분의 경우 useContextMenu와 동일한 조건
    if (!targetRef.current.closest(USER_INFO)) return;

    // 데이터 가공 후 반환
    const url = targetRef.current.src.split('?')[0];
    setData(url);
  }, [open, targetRef]);

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
