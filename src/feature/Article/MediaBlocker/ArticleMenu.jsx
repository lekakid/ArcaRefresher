import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';

import { ARTICLE_CONTENT, DELETED_ALERT_LOADED } from 'constants/selector';
import { useLoadChecker } from 'core/LoadChecker';

import info from './info';

// 게시물 상단 메뉴
export default function ArticleMenu() {
  const { blockAll, blockDeleted, blockReported } = useSelector(
    (state) => state[info.id].storage,
  );
  const alertLoaded = useLoadChecker(DELETED_ALERT_LOADED);

  const handleClick = useCallback(() => {
    const body = document.querySelector(ARTICLE_CONTENT);
    body.classList.add('media-blocker-unhide');
  }, []);

  if (!(
    blockAll ||
    (alertLoaded && blockDeleted) ||
    (document.referrer.includes('/reports/') && blockReported)
  ))
    return null;

  return (
    <Button
      size="small"
      variant="text"
      startIcon={<ImageSearchIcon />}
      onClick={handleClick}
    >
      이미지 숨기기 해제
    </Button>
  );
}
