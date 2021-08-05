import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Assignment, GetApp, Image as ImageIcon } from '@material-ui/icons';
import { saveAs } from 'file-saver';

import ContextMenuGroup from '../$ContextMenu/ContextMenuGroup';
import fetch from '../$Common/Fetch';

import { getArticleInfo, replaceFlag } from './FlagHandler';

export default function ContextMenu({ data, onClose, setSnack }) {
  const config = useSelector((state) => state.ImageDownloader);
  const [articleInfo, setArticleInfo] = useState(null);

  useEffect(() => {
    setArticleInfo(getArticleInfo());
  }, []);

  const handleClipboard = useCallback(() => {
    (async () => {
      for (let i = 0; i < config.retryCount; i += 1) {
        try {
          onClose();
          setSnack('이미지를 다운로드 받는 중...');
          // eslint-disable-next-line no-await-in-loop
          const { response: rawData } = await fetch({
            url: data.orig,
            timeout: 10000,
            responseType: 'blob',
          });

          const canvas = document.createElement('canvas');
          const canvasContext = canvas.getContext('2d');
          // eslint-disable-next-line no-await-in-loop
          const convertedBlob = await new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              canvasContext.drawImage(img, 0, 0);
              canvas.toBlob((blob) => {
                resolve(blob);
              });
            };
            img.src = URL.createObjectURL(rawData);
          });
          canvas.remove();
          const item = new ClipboardItem({
            [convertedBlob.type]: convertedBlob,
          });
          navigator.clipboard.write([item]);
          setSnack('클립보드에 이미지가 복사되었습니다.');
          break;
        } catch (error) {
          console.warn('다운로드 실패로 인한 재시도', data.orig, error);
        }
      }
    })();
  }, [config.retryCount, data.orig, onClose, setSnack]);

  const handleDownload = useCallback(() => {
    (async () => {
      for (let i = 0; i < config.retryCount; i += 1) {
        try {
          onClose();
          setSnack('이미지를 다운로드 받는 중...');
          // eslint-disable-next-line no-await-in-loop
          const { response: blob } = await fetch({
            url: data.orig,
            timeout: 10000,
            responseType: 'blob',
          });

          saveAs(
            blob,
            `${replaceFlag(config.fileName, {
              ...articleInfo,
              uploadName: data.uploadName,
            })}.${data.ext}`,
          );
          setSnack('');
          break;
        } catch (error) {
          console.warn('다운로드 실패로 인한 재시도', data.orig, error);
        }
      }
    })();
  }, [
    articleInfo,
    config.fileName,
    config.retryCount,
    data.ext,
    data.orig,
    data.uploadName,
    onClose,
    setSnack,
  ]);

  const handleCopyURL = useCallback(() => {
    onClose();
    navigator.clipboard.writeText(data.orig);
  }, [data.orig, onClose]);

  return (
    <ContextMenuGroup>
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
    </ContextMenuGroup>
  );
}
