import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import { Visibility, VisibilityOff, ZoomIn } from '@material-ui/icons';

import { useElementQuery } from 'core/hooks';

import { toggleHideDeletedArticleMedia } from './slice';
import { MODULE_ID } from './ModuleInfo';

export default function ArticleMenu() {
  const {
    config: { blockDeletedArticleMedia },
    hideDeletedArticleMedia,
  } = useSelector((state) => state[MODULE_ID]);
  const dispatch = useDispatch();
  const alertLoaded = useElementQuery('.board-title + .alert-danger');

  const handleBlockDeletedArticleMedia = useCallback(() => {
    dispatch(toggleHideDeletedArticleMedia());
  }, [dispatch]);

  const handleThumbnail = useCallback(() => {
    const thumb = document.querySelector(
      '.article-content img, .article-content video',
    );
    thumb.style = { width: '', height: '' };
  }, []);

  return (
    <>
      {alertLoaded && blockDeletedArticleMedia && (
        <Button
          size="small"
          startIcon={
            hideDeletedArticleMedia ? <Visibility /> : <VisibilityOff />
          }
          onClick={handleBlockDeletedArticleMedia}
        >
          {hideDeletedArticleMedia ? '안구 보호 해제' : '안구 보호 사용'}
        </Button>
      )}
      <Button size="small" startIcon={<ZoomIn />} onClick={handleThumbnail}>
        섬네일 확대
      </Button>
    </>
  );
}
