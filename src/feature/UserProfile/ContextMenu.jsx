import React, { useCallback, useEffect, useState } from 'react';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Assignment, Person } from '@material-ui/icons';

import { USER_INFO } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';
import { getUserNick } from 'func/user';

function ContextMenu({ targetRef }) {
  const [open, closeMenu, setSnack] = useContextMenu({
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

    const id = getUserNick(userInfo);
    if (id.includes('.')) {
      // 유동
      setData(undefined);
      return;
    }

    setData({ id, url: id.replace('#', '/') });
  }, [open, targetRef]);

  const handleProfile = useCallback(() => {
    window.open(`https://arca.live/u/@${data.url}`);
    closeMenu();
  }, [closeMenu, data]);

  const handleCopyId = useCallback(async () => {
    closeMenu();
    await navigator.clipboard.writeText(`@${data.id}`);
    setSnack({ msg: '아이디가 복사되었습니다.', time: 3000 });
  }, [closeMenu, data, setSnack]);

  if (!data) return null;
  return (
    <List>
      <MenuItem onClick={handleProfile}>
        <ListItemIcon>
          <Person />
        </ListItemIcon>
        <Typography>사용자 정보</Typography>
      </MenuItem>
      <MenuItem onClick={handleCopyId}>
        <ListItemIcon>
          <Assignment />
        </ListItemIcon>
        <Typography>멘션 아이디 복사</Typography>
      </MenuItem>
    </List>
  );
}

export default ContextMenu;
