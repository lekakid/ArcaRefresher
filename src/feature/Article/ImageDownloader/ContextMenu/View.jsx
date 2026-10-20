import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItemIcon, MenuItem, Typography } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GetAppIcon from '@mui/icons-material/GetApp';
import ImageIcon from '@mui/icons-material/Image';

import { ARTICLE_GIFS, ARTICLE_IMAGES } from 'core/selector';
import { useContextMenu } from 'feature/Menu/ContextMenu';
import { useSnackbarAlert } from 'feature/Menu/SnackbarAlert';
import { useContent } from 'hooks/Content';
import { request } from 'func/http';

import { convertToPng } from 'func/image';
import { saveFile } from 'func/file';
import { ImageInfo } from '../Model';
import { format } from '../Util';
import info from '../info';

function ContextMenu({ target, closeMenu }) {
  const { contextMenuEnabled, originToClipboard, fileName } = useSelector(
    (state) => state[info.id].storage,
  );
  const contentInfo = useContent();

  const setSnack = useSnackbarAlert();
  const data = useContextMenu(
    {
      key: info.id,
      selector: contextMenuEnabled
        ? `${ARTICLE_IMAGES}, ${ARTICLE_GIFS}`
        : 'NULL',
      dataExtractor: () => {
        if (!target) return undefined;
        if (!contentInfo.config) return undefined;

        return new ImageInfo(target);
      },
    },
    [target, contentInfo.config],
  );

  const handleClipboard = useCallback(() => {
    (async () => {
      const { orig, thumb, ext } = data;

      try {
        closeMenu();
        setSnack({ msg: '이미지를 다운로드 중...' });

        const isGif = ext === 'gif';
        const url = originToClipboard && !isGif ? orig : thumb;
        const response = await request(url, {
          responseType: 'blob',
        }).then((r) => r.response);
        const blob = await convertToPng(response);

        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        setSnack({
          msg: '클립보드에 이미지가 복사되었습니다.',
          time: 3000,
        });
      } catch (error) {
        console.warn('다운로드 실패', orig, error);
        setSnack({
          msg: '이미지 다운로드에 실패했습니다.',
          time: 3000,
        });
      }
    })();
  }, [data, originToClipboard, closeMenu, setSnack]);

  const handleDownload = useCallback(() => {
    (async () => {
      const { orig, ext, name: uploadName } = data;

      try {
        closeMenu();

        const response = await fetch(orig, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const name = format(fileName, {
          content: contentInfo,
          name: uploadName,
        });
        saveFile(`${name}.${ext}`, await response.blob());
      } catch (error) {
        console.warn(`[ImageDownload] ${uploadName} 다운로드 실패`, error);
        setSnack({
          msg: '이미지 다운로드에 실패했습니다.',
          time: 3000,
        });
      }
    })();
  }, [data, closeMenu, fileName, contentInfo, setSnack]);

  const handleCopyURL = useCallback(() => {
    closeMenu();
    navigator.clipboard.writeText(data.orig);
  }, [closeMenu, data]);

  if (!data) return null;
  return (
    <List>
      <MenuItem onClick={handleClipboard}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <Typography>클립보드로 복사</Typography>
      </MenuItem>
      <MenuItem onClick={handleDownload}>
        <ListItemIcon>
          <GetAppIcon />
        </ListItemIcon>
        <Typography>이미지 저장</Typography>
      </MenuItem>
      <MenuItem onClick={handleCopyURL}>
        <ListItemIcon>
          <ImageIcon />
        </ListItemIcon>
        <Typography>이미지 주소 복사</Typography>
      </MenuItem>
    </List>
  );
}

ContextMenu.propTypes = {
  target: PropTypes.object,
  closeMenu: PropTypes.func,
};

export default ContextMenu;
