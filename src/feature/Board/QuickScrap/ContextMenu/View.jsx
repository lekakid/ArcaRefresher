import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Bookmark } from '@material-ui/icons';

import { BOARD_ITEMS } from 'core/selector';
import { useContextMenu, useContextSnack } from 'menu/ContextMenu';
import { useContent } from 'util/ContentInfo';

import Info from '../FeatureInfo';

// 우클릭 메뉴
function ContextMenu({ targetRef }) {
  const { enabled } = useSelector((store) => store[Info.ID].storage);
  const { channel } = useContent();
  const setSnack = useContextSnack();
  const [data, closeMenu] = useContextMenu({
    targetRef,
    selector: `${enabled ? BOARD_ITEMS : 'NULL'}`,
    dataExtractor: (target) => {
      // 로그인 체크
      if (!unsafeWindow.LiveConfig?.nickname) return undefined;

      if (!target.matches('a')) {
        const articleId = target
          .querySelector('a.title')
          .pathname.split('/')
          .pop();
        return articleId;
      }

      const articleId = target.pathname.split('/').pop();
      return articleId;
    },
  });

  const handleClick = useCallback(async () => {
    closeMenu();

    const response = await fetch(
      `https://arca.live/api/scrap?slug=${channel.ID}&articleId=${data}`,
    ).then((r) => r.json());
    if (!response.result) {
      setSnack({ msg: '스크랩 실패 (서버 오류?)', time: 3000 });
      return;
    }

    setSnack({
      msg: `스크랩 ${response.isScrap ? '되었습니다' : '취소되었습니다'}.`,
      time: 3000,
    });
  }, [channel, closeMenu, data, setSnack]);

  if (!data) return null;
  return (
    <List>
      <MenuItem onClick={handleClick}>
        <ListItemIcon>
          <Bookmark />
        </ListItemIcon>
        <Typography>게시물 스크랩</Typography>
      </MenuItem>
    </List>
  );
}

export default ContextMenu;
