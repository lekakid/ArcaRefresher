import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Assignment, GetApp, Image as ImageIcon } from '@material-ui/icons';
import { saveAs } from 'file-saver';

import { MODULE_ID as CONTEXT_MODULE_ID } from '../$ContextMenu/ModuleInfo';
import ContextMenuList from '../$ContextMenu/ContextMenuList';
import { closeContextMenu, setContextSnack } from '../$ContextMenu/slice';
import fetch from '../$Common/Fetch';

import { MODULE_ID } from './ModuleInfo';
import { getArticleInfo, replaceFlag } from './func';

export default function ContextMenu() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state[CONTEXT_MODULE_ID]);
  const config = useSelector((state) => state[MODULE_ID]);
  const [articleInfo, setArticleInfo] = useState(null);
  const imgData = data[MODULE_ID];

  useEffect(() => {
    setArticleInfo(getArticleInfo());
  }, []);

  const handleClipboard = useCallback(() => {
    (async () => {
      for (let i = 0; i < config.retryCount; i += 1) {
        try {
          dispatch(closeContextMenu());
          dispatch(setContextSnack({ msg: '이미지를 다운로드 받는 중...' }));
          // eslint-disable-next-line no-await-in-loop
          const { response: rawData } = await fetch({
            url: imgData.orig,
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
          dispatch(
            setContextSnack({
              msg: '클립보드에 이미지가 복사되었습니다.',
              time: 3000,
            }),
          );
          break;
        } catch (error) {
          console.warn('다운로드 실패로 인한 재시도', imgData.orig, error);
        }
      }
    })();
  }, [config.retryCount, imgData.orig, dispatch]);

  const handleDownload = useCallback(() => {
    (async () => {
      for (let i = 0; i < config.retryCount; i += 1) {
        try {
          dispatch(closeContextMenu());
          dispatch(setContextSnack({ msg: '이미지를 다운로드 받는 중...' }));
          // eslint-disable-next-line no-await-in-loop
          const { response: blob } = await fetch({
            url: imgData.orig,
            timeout: 10000,
            responseType: 'blob',
          });

          saveAs(
            blob,
            `${replaceFlag(config.fileName, {
              ...articleInfo,
              uploadName: imgData.uploadName,
            })}.${imgData.ext}`,
          );
          dispatch(setContextSnack({ msg: '' }));
          break;
        } catch (error) {
          console.warn('다운로드 실패로 인한 재시도', imgData.orig, error);
        }
      }
    })();
  }, [
    articleInfo,
    config.fileName,
    config.retryCount,
    imgData.ext,
    imgData.orig,
    imgData.uploadName,
    dispatch,
  ]);

  const handleCopyURL = useCallback(() => {
    dispatch(closeContextMenu());
    navigator.clipboard.writeText(imgData.orig);
  }, [imgData.orig, dispatch]);

  return (
    <ContextMenuList>
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
    </ContextMenuList>
  );
}
