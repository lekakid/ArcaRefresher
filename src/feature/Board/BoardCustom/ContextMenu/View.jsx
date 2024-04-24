import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { Bookmark, OpenInNew } from '@mui/icons-material';

import { BOARD_ITEMS } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';
import { useSnackbarAlert } from 'menu/SnackbarAlert';
import { useContent } from 'hooks/Content';

import { BACKGROUND, open } from 'func/window';
import Info from '../FeatureInfo';

// 우클릭 메뉴
function ContextMenu({ target, closeMenu }) {
  const { contextMenuEnabled } = useSelector((store) => store[Info.id].storage);
  const { user, channel } = useContent();
  const setSnack = useSnackbarAlert();
  const data = useContextMenu(
    {
      key: Info.id,
      selector: `${contextMenuEnabled ? BOARD_ITEMS : 'NULL'}`,
      dataExtractor: () => {
        if (!target) return undefined;

        const url = target.href || target.querySelector('a.title').href;
        const articleId = url.split('/').pop().split('?')[0];

        return {
          articleId,
          url,
        };
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
      `https://arca.live/api/scrap?slug=${channel.id}&articleId=${data.articleId}`,
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
      {user && (
        <MenuItem onClick={handleScrap}>
          <ListItemIcon>
            <Bookmark />
          </ListItemIcon>
          <Typography>게시물 스크랩</Typography>
        </MenuItem>
      )}
    </List>
  );
}

ContextMenu.propTypes = {
  target: PropTypes.object,
  closeMenu: PropTypes.func,
};

export default ContextMenu;
