import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import { ImageSearch } from '@material-ui/icons';

import { useElementQuery } from 'core/hooks';
import { ARTICLE_CONTENT, DELETED_ALERT_LOADED } from 'core/selector';

import Info from './FeatureInfo';

// 게시물 상단 메뉴
export default function ArticleMenu() {
  const {
    config: { enabled, deletedOnly },
  } = useSelector((state) => state[Info.ID]);
  const alertLoaded = useElementQuery(DELETED_ALERT_LOADED);

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
