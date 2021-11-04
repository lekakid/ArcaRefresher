import React, { useCallback } from 'react';
import { Button } from '@material-ui/core';
import { ZoomIn } from '@material-ui/icons';

export default function ArticleMenu() {
  const handleToggle = useCallback(() => {
    const thumb = document.querySelector(
      '.article-content img, .article-content video',
    );
    thumb.style = { width: '', height: '' };
  }, []);

  return (
    <Button size="small" startIcon={<ZoomIn />} onClick={handleToggle}>
      섬네일 확대
    </Button>
  );
}
