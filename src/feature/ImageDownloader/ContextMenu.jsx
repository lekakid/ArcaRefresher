import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Assignment, GetApp, Image as ImageIcon } from '@material-ui/icons';
import { saveAs } from 'file-saver';

import { ARTICLE_IMAGES, ARTICLE_LOADED } from 'core/selector';
import { useElementQuery } from 'core/hooks';
import { setClose, setContextSnack } from 'menu/ContextMenu/slice';

import { MODULE_ID } from './ModuleInfo';
import { getArticleInfo, getImageInfo, replaceFormat } from './func';

function ContextMenu({ triggerList }) {
  const dispatch = useDispatch();
  const { fileName } = useSelector((state) => state[MODULE_ID]);
  const articleLoaded = useElementQuery(ARTICLE_LOADED);
  const articleInfo = useRef(null);
  const data = useRef(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const trigger = (target) => {
      if (!target.closest(ARTICLE_IMAGES)) {
        data.current = null;
        setValid(false);
        return false;
      }

      data.current = getImageInfo(target);
      setValid(true);
      return true;
    };

    triggerList.current.push(trigger);
  }, [triggerList]);

  useEffect(() => {
    if (!articleLoaded) return;
    if (articleInfo.current) return;
    articleInfo.current = getArticleInfo();
  }, [articleLoaded]);

  const handleClipboard = useCallback(() => {
    (async () => {
      const { orig } = data.current;

      try {
        dispatch(setClose());
        dispatch(setContextSnack({ msg: '이미지를 다운로드 받는 중...' }));
        // eslint-disable-next-line no-await-in-loop
        const response = await fetch(orig);
        if (!response.ok) throw new Error('네트워크 오류로 중단');

        // eslint-disable-next-line no-await-in-loop
        const rawData = await response.blob();

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
      } catch (error) {
        console.warn('다운로드 실패', orig, error);
        dispatch(
          setContextSnack({
            msg: '이미지 다운로드에 실패했습니다.',
            time: 3000,
          }),
        );
      }
    })();
  }, [dispatch]);

  const handleDownload = useCallback(() => {
    (async () => {
      const { orig, ext, uploadName } = data.current;
      try {
        dispatch(setClose());
        dispatch(setContextSnack({ msg: '이미지를 다운로드 받는 중...' }));
        // eslint-disable-next-line no-await-in-loop
        const response = await fetch(orig);
        if (!response.ok) throw new Error('네트워크 오류로 중단');

        // eslint-disable-next-line no-await-in-loop
        const blob = await response.blob();

        saveAs(
          blob,
          `${replaceFormat(fileName, {
            ...articleInfo.current,
            uploadName,
          })}.${ext}`,
        );
        dispatch(setContextSnack({ msg: '' }));
      } catch (error) {
        console.warn('다운로드 실패', orig, error);
        dispatch(
          setContextSnack({
            msg: '이미지 다운로드에 실패했습니다.',
            time: 3000,
          }),
        );
      }
    })();
  }, [fileName, dispatch]);

  const handleCopyURL = useCallback(() => {
    dispatch(setClose());
    navigator.clipboard.writeText(data.current.orig);
  }, [dispatch]);

  if (!valid) return null;
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

export default ContextMenu;
