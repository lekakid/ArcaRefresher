import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItemIcon, MenuItem, Typography } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GetAppIcon from '@mui/icons-material/GetApp';
import ImageIcon from '@mui/icons-material/Image';
import streamSaver from 'streamsaver';

import { ARTICLE_GIFS, ARTICLE_IMAGES } from 'constants/selector';
import { useContextMenuTrigger } from 'feature/Menu/ContextMenu/hooks';
import { useSnackbarAlert } from 'feature/Menu/SnackbarAlert';
import { useContent } from 'core/ContentCollector';
import { request } from 'func/http';

import { convertToPng } from 'func/image';
import { ImageInfo } from '../Model';
import { format } from '../Util';
import info from '../info';

function ImageDownloader({ target, closeMenu }) {
  const setSnack = useSnackbarAlert();

  const contentInfo = useContent();
  const { contextMenuEnabled, originToClipboard, fileName } = useSelector(
    (state) => state[info.id].storage,
  );

  // 트리거 등록
  useContextMenuTrigger({
    key: info.id,
    selector: contextMenuEnabled
      ? `${ARTICLE_IMAGES}, ${ARTICLE_GIFS}`
      : 'NULL',
  });

  const data = useMemo(() => {
    if (!target) return null;

    return new ImageInfo(target);
  }, [target]);

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
        const size = Number(response.headers.get('content-length'));
        const stream = response.body;

        const name = format(fileName, {
          content: contentInfo,
          name: uploadName,
        });
        const filestream = streamSaver.createWriteStream(`${name}.${ext}`, {
          size,
        });
        await stream.pipeTo(filestream);
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

ImageDownloader.propTypes = {
  target: PropTypes.object,
  closeMenu: PropTypes.func,
};

export default ImageDownloader;
