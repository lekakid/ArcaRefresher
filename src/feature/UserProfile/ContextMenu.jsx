import React, { useCallback } from 'react';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Assignment, Person, Search } from '@material-ui/icons';

import { USER_INFO } from 'core/selector';
import { useContextMenu, useContextSnack } from 'menu/ContextMenu';
import { getUserNick } from 'func/user';
import { useContent } from 'util/ContentInfo';

function ContextMenu({ targetRef }) {
  const setSnack = useContextSnack();
  const { channel } = useContent();
  const [data, closeMenu] = useContextMenu({
    targetRef,
    selector: USER_INFO,
    dataExtractor: (target) => {
      const id = getUserNick(target);
      if (id.includes('.')) return undefined;

      return { id, url: id.replace('#', '/') };
    },
  });

  const handleProfile = useCallback(() => {
    window.open(`https://arca.live/u/@${data.url}`);
    closeMenu();
  }, [closeMenu, data]);

  const handleCopyId = useCallback(async () => {
    closeMenu();
    await navigator.clipboard.writeText(`@${data.id}`);
    setSnack({ msg: '아이디가 복사되었습니다.', time: 3000 });
  }, [closeMenu, data, setSnack]);

  const handleSearchAll = useCallback(async () => {
    window.open(
      `https://arca.live/b/breaking?target=nickname&keyword=${
        data.id.split('#')[0]
      }`,
    );
    closeMenu();
  }, [closeMenu, data]);

  const handleSearchChannel = useCallback(async () => {
    window.open(
      `https://arca.live/b/${channel.ID}?target=nickname&keyword=${
        data.id.split('#')[0]
      }`,
    );
    closeMenu();
  }, [channel, closeMenu, data]);

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
      <MenuItem onClick={handleSearchChannel}>
        <ListItemIcon>
          <Search />
        </ListItemIcon>
        <Typography>채널 내 검색</Typography>
      </MenuItem>
      <MenuItem onClick={handleSearchAll}>
        <ListItemIcon>
          <Search />
        </ListItemIcon>
        <Typography>종합속보 검색</Typography>
      </MenuItem>
    </List>
  );
}

ContextMenu.sortOrder = 0;

export default ContextMenu;
