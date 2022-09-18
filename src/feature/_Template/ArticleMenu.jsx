import React, { useCallback } from 'react';
import { Button } from '@material-ui/core';
import { PeopleAltOutlined } from '@material-ui/icons';

// import Info from './FeatureInfo';

// 게시물 상단 메뉴
export default function ArticleMenu() {
  const handleToggle = useCallback(() => {
    // 클릭 시 동작 작성
  }, []);

  return (
    <Button
      size="small"
      startIcon={<PeopleAltOutlined />}
      onClick={handleToggle}
    >
      버튼
    </Button>
  );
}
