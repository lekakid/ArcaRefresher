import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import { ImageSearch } from '@material-ui/icons';

import { ARTICLE_CONTENT, DELETED_ALERT_LOADED } from 'core/selector';
import { useLoadChecker } from 'hooks';

import Info from './FeatureInfo';

// 게시물 상단 메뉴
export default function ArticleMenu() {
  const {
    storage: { enabled, deletedOnly },
  } = useSelector((state) => state[Info.ID]);
  const alertLoaded = useLoadChecker(DELETED_ALERT_LOADED);

  const handleClick = useCallback(() => {
    const body = document.querySelector(ARTICLE_CONTENT);
    body.classList.add('media-blocker-unhide');
  }, []);

  if (!enabled || (deletedOnly && !alertLoaded)) return null;

  return (
    <Button size="small" startIcon={<ImageSearch />} onClick={handleClick}>
      이미지 숨기기 해제
    </Button>
  );
}
