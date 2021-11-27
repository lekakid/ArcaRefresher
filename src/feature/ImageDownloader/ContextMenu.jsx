import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Assignment, GetApp, Image as ImageIcon } from '@material-ui/icons';
import { saveAs } from 'file-saver';

import { ARTICLE_IMAGES, ARTICLE_LOADED } from 'core/selector';
import { useElementQuery } from 'core/hooks';
import { ContextMenuList, useContextMenu } from 'menu/ContextMenu';
import { setClose, setContextSnack } from 'menu/ContextMenu/slice';
import fetch from 'util/fetch';

import { MODULE_ID } from './ModuleInfo';
import { getArticleInfo, replaceFormat } from './func';

const ContextMenu = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function ContextMenu(_props, ref) {
    const dispatch = useDispatch();
    const { fileName, retryCount } = useSelector((state) => state[MODULE_ID]);
    const articleLoaded = useElementQuery(ARTICLE_LOADED);
    const articleInfo = useRef(null);

    const trigger = useCallback(
      ({ target }) => !!target.closest(ARTICLE_IMAGES),
      [],
    );
    const dataGetter = useCallback(({ target }) => {
      const url = target.src.split('?')[0];

      const orig = `${url}${
        target.tagName === 'VIDEO' ? '.gif' : ''
      }?type=orig`;
      const [, ext] =
        target.tagName === 'VIDEO' ? [0, 'gif'] : url.match(/\.(.{3,4})$/);
      const [uploadName] = url.match(/[0-9a-f]{64}/g);

      return { orig, ext, uploadName };
    }, []);
    const data = useContextMenu({ trigger, dataGetter });

    useEffect(() => {
      if (!articleLoaded) return;
      if (articleInfo.current) return;
      articleInfo.current = getArticleInfo();
    }, [articleLoaded]);

    const handleClipboard = useCallback(() => {
      (async () => {
        for (let i = 0; i < retryCount; i += 1) {
          try {
            dispatch(setClose());
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
            dispatch(
              setContextSnack({
                msg: '클립보드에 이미지가 복사되었습니다.',
                time: 3000,
              }),
            );
            break;
          } catch (error) {
            console.warn('다운로드 실패로 인한 재시도', data.orig, error);
          }
        }
      })();
    }, [retryCount, data, dispatch]);

    const handleDownload = useCallback(() => {
      (async () => {
        const { orig, ext, uploadName } = data;
        for (let i = 0; i < retryCount; i += 1) {
          try {
            dispatch(setClose());
            dispatch(setContextSnack({ msg: '이미지를 다운로드 받는 중...' }));
            // eslint-disable-next-line no-await-in-loop
            const { response: blob } = await fetch({
              url: orig,
              timeout: 10000,
              responseType: 'blob',
            });

            saveAs(
              blob,
              `${replaceFormat(fileName, {
                ...articleInfo.current,
                uploadName,
              })}.${ext}`,
            );
            dispatch(setContextSnack({ msg: '' }));
            break;
          } catch (error) {
            console.warn('다운로드 실패로 인한 재시도', orig, error);
          }
        }
      })();
    }, [data, fileName, retryCount, dispatch]);

    const handleCopyURL = useCallback(() => {
      dispatch(setClose());
      navigator.clipboard.writeText(data.orig);
    }, [data, dispatch]);

    if (!data) return null;
    return (
      <ContextMenuList>
        <MenuItem ref={ref} onClick={handleClipboard}>
          <ListItemIcon>
            <Assignment />
          </ListItemIcon>
          <Typography>클립보드로 복사</Typography>
        </MenuItem>
        <MenuItem ref={ref} onClick={handleDownload}>
          <ListItemIcon>
            <GetApp />
          </ListItemIcon>
          <Typography>이미지 저장</Typography>
        </MenuItem>
        <MenuItem ref={ref} onClick={handleCopyURL}>
          <ListItemIcon>
            <ImageIcon />
          </ListItemIcon>
          <Typography>이미지 주소 복사</Typography>
        </MenuItem>
      </ContextMenuList>
    );
  },
);

export default ContextMenu;
