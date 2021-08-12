import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Assignment, GetApp, Image as ImageIcon } from '@material-ui/icons';
import { saveAs } from 'file-saver';

import { MODULE_ID as CONTEXT_MODULE_ID } from '../$ContextMenu/ModuleInfo';
import ContextMenuGroup from '../$ContextMenu/ContextMenuGroup';
import { setContextOpen, setContextSnack } from '../$ContextMenu/slice';
import fetch from '../$Common/Fetch';

import { MODULE_ID } from './ModuleInfo';
import { getArticleInfo, replaceFlag } from './FlagHandler';

export default function ContextMenu() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state[CONTEXT_MODULE_ID]);
  const config = useSelector((state) => state[MODULE_ID]);
  const [articleInfo, setArticleInfo] = useState(null);

  useEffect(() => {
    setArticleInfo(getArticleInfo());
  }, []);

  const handleClipboard = useCallback(() => {
    (async () => {
      for (let i = 0; i < config.retryCount; i += 1) {
        try {
          dispatch(setContextOpen(false));
          dispatch(setContextSnack({ msg: '이미지를 다운로드 받는 중...' }));
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
          setContextSnack({
            msg: '클립보드에 이미지가 복사되었습니다.',
            time: 3000,
          });
          break;
        } catch (error) {
          console.warn('다운로드 실패로 인한 재시도', data.orig, error);
        }
      }
    })();
  }, [config.retryCount, data.orig, dispatch]);

  const handleDownload = useCallback(() => {
    (async () => {
      for (let i = 0; i < config.retryCount; i += 1) {
        try {
          dispatch(setContextOpen(false));
          dispatch(setContextSnack({ msg: '이미지를 다운로드 받는 중...' }));
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
          dispatch(setContextSnack({ msg: '' }));
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
    dispatch,
  ]);

  const handleCopyURL = useCallback(() => {
    dispatch(setContextOpen(false));
    navigator.clipboard.writeText(data.orig);
  }, [data.orig, dispatch]);

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