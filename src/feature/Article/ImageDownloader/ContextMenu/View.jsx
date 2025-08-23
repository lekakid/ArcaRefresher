import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { Assignment, GetApp, Image as ImageIcon } from '@mui/icons-material';
import streamSaver from 'streamsaver';

import { ARTICLE_GIFS, ARTICLE_IMAGES } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';
import { useSnackbarAlert } from 'menu/SnackbarAlert';
import { useContent } from 'hooks/Content';
import { request } from 'func/http';

import { format, ImageInfo } from '../func';
import Info from '../FeatureInfo';

async function convertToPng(blob) {
  const canvas = document.createElement('canvas');
  const canvasContext = canvas.getContext('2d');

  const result = await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      canvasContext.drawImage(img, 0, 0);
      canvas.toBlob((b) => resolve(b));
    };
    img.src = URL.createObjectURL(blob);
  });
  canvas.remove();

  return result;
}

function ContextMenu({ target, closeMenu }) {
  const { contextMenuEnabled, originToClipboard, fileName } = useSelector(
    (state) => state[Info.id].storage,
  );
  const contentInfo = useContent();

  const setSnack = useSnackbarAlert();
  const data = useContextMenu(
    {
      key: Info.id,
      selector: contextMenuEnabled
        ? `${ARTICLE_IMAGES}, ${ARTICLE_GIFS}`
        : 'NULL',
      dataExtractor: () => {
        if (!target) return undefined;

        return new ImageInfo(target);
      },
    },
    [target],
  );

  const handleClipboard = useCallback(() => {
    (async () => {
      const { orig, thumb } = data;

      try {
        closeMenu();

        setSnack({ msg: '이미지를 다운로드 중...' });
        const response = await request(originToClipboard ? orig : thumb, {
          responseType: 'blob',
        }).then((r) => r.response);
        const blob =
          response.type === 'image/png'
            ? response
            : await convertToPng(response);

        navigator.clipboard.write([
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
      const { orig } = data;
      const { ext, uploadName } = data;
      try {
        closeMenu();
        const name = format(fileName, {
          content: contentInfo,
          fileName: uploadName,
        });

        const response = await fetch(orig, { cache: 'no-cache' });
        const size = Number(response.headers.get('content-length'));
        const stream = response.body;

        const filestream = streamSaver.createWriteStream(`${name}.${ext}`, {
          size,
        });
        stream.pipeTo(filestream);
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
          <Assignment />
        </ListItemIcon>
        <Typography>클립보드로 복사</Typography>
      </MenuItem>
      <MenuItem onClick={handleDownload}>
        <ListItemIcon>
          <GetApp />
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
