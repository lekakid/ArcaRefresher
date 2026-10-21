import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItemIcon, MenuItem, Typography } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { BOARD_ITEMS } from 'core/selector';
import { useContextMenuTrigger } from 'feature/Menu/ContextMenu';
import { useSnackbarAlert } from 'feature/Menu/SnackbarAlert';
import { useContent } from 'hooks/Content';
import { BACKGROUND, open } from 'func/window';

import info from '../info';

// 우클릭 메뉴
function BoardCustom({ target, closeMenu }) {
  const setSnack = useSnackbarAlert();

  const { user, channel } = useContent();
  const { contextMenuEnabled } = useSelector((store) => store[info.id].storage);

  // 트리거 등록
  useContextMenuTrigger({
    key: info.id,
    selector: `${contextMenuEnabled ? BOARD_ITEMS : 'NULL'}`,
  });

  const data = useMemo(() => {
    if (!target) return null;

    const url = target.href || target.querySelector('a.title').href;
    const articleId = url.split('/').pop().split('?')[0];

    return {
      articleId,
      url,
    };
  }, [target]);

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
          <OpenInNewIcon />
        </ListItemIcon>
        <Typography>새 창으로 열기</Typography>
      </MenuItem>
      {user && (
        <MenuItem onClick={handleScrap}>
          <ListItemIcon>
            <BookmarkIcon />
          </ListItemIcon>
          <Typography>게시물 스크랩</Typography>
        </MenuItem>
      )}
    </List>
  );
}

BoardCustom.propTypes = {
  target: PropTypes.object,
  closeMenu: PropTypes.func,
};

export default BoardCustom;
