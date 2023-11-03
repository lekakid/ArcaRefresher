import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Assignment, Person, Search } from '@material-ui/icons';

import { BOARD_ITEMS_WITH_NOTICE, USER_INFO } from 'core/selector';
import { useContextMenu, useContextSnack } from 'menu/ContextMenu';
import { getUserNick } from 'func/user';
import { useContent } from 'util/ContentInfo';

import { open } from 'func/window';
import Info from '../FeatureInfo';

function ContextMenu({ targetRef }) {
  const setSnack = useContextSnack();
  const { contextRange, openType } = useSelector(
    (store) => store[Info.ID].storage,
  );
  const { channel } = useContent();
  let contextSelector;
  switch (contextRange) {
    case 'articleItem':
      contextSelector = `${BOARD_ITEMS_WITH_NOTICE}, ${USER_INFO}`;
      break;
    case 'nickname':
      contextSelector = USER_INFO;
      break;
    default:
      console.warn('[UserProfile] contextRange 값이 올바르지 않음');
      contextSelector = USER_INFO;
  }

  const [data, closeMenu] = useContextMenu({
    targetRef,
    selector: contextSelector,
    dataExtractor: (target) => {
      let userElement = target;
      if (target.matches('.vrow')) {
        userElement = target.querySelector('span.user-info');
      }
      if (!userElement) return undefined;

      const id = getUserNick(userElement);
      // 유동 제외
      if (id.includes('.')) return undefined;

      return { id, url: id.replace('#', '/') };
    },
  });

  const handleProfile = useCallback(() => {
    open(`https://arca.live/u/@${data.url}`, openType);
    closeMenu();
  }, [closeMenu, data, openType]);

  const handleCopyId = useCallback(async () => {
    closeMenu();
    await navigator.clipboard.writeText(`@${data.id}`);
    setSnack({ msg: '아이디가 복사되었습니다.', time: 3000 });
  }, [closeMenu, data, setSnack]);

  const handleSearchAll = useCallback(async () => {
    open(
      `https://arca.live/b/breaking?target=nickname&keyword=${
        data.id.split('#')[0]
      }`,
      openType,
    );
    closeMenu();
  }, [closeMenu, data, openType]);

  const handleSearchChannel = useCallback(async () => {
    open(
      `https://arca.live/b/${channel.ID}?target=nickname&keyword=${
        data.id.split('#')[0]
      }`,
      openType,
    );
    closeMenu();
  }, [channel, closeMenu, data, openType]);

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

export default ContextMenu;
