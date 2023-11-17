import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Bookmark, OpenInNew } from '@material-ui/icons';

import { BOARD_ITEMS } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';
import { useSnackbarAlert } from 'menu/SnackbarAlert';
import { useContent } from 'hooks/Content';

import { BACKGROUND, open } from 'func/window';
import Info from '../FeatureInfo';

// 우클릭 메뉴
function ContextMenu({ target }) {
  const { contextMenuEnabled } = useSelector((store) => store[Info.ID].storage);
  const { channel } = useContent();
  const setSnack = useSnackbarAlert();
  const [data, closeMenu] = useContextMenu(
    {
      key: Info.ID,
      selector: `${contextMenuEnabled ? BOARD_ITEMS : 'NULL'}`,
      dataExtractor: () => {
        if (!target) return undefined;

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
        const url = target.href;
        return { articleId, url };
      },
    },
    [target],
  );

  const handleOpen = useCallback(() => {
    open(data.url, BACKGROUND);
    closeMenu();
  }, [closeMenu, data]);

  const handleScrap = useCallback(async () => {
    closeMenu();

    const response = await fetch(
      `https://arca.live/api/scrap?slug=${channel.ID}&articleId=${data.articleId}`,
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
      <MenuItem onClick={handleOpen}>
        <ListItemIcon>
          <OpenInNew />
        </ListItemIcon>
        <Typography>새 창으로 열기</Typography>
      </MenuItem>
      <MenuItem onClick={handleScrap}>
        <ListItemIcon>
          <Bookmark />
        </ListItemIcon>
        <Typography>게시물 스크랩</Typography>
      </MenuItem>
    </List>
  );
}

export default ContextMenu;