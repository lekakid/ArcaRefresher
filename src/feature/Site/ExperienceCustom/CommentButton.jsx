import { Button } from '@mui/material';
import React, { useCallback } from 'react';

export default function CommentButton() {
  const handleClick = useCallback(() => {
    document.querySelector('#comment').classList.add('temp-show');
  }, []);

  return (
    <Button fullWidth onClick={handleClick}>
      댓글 펼치기
    </Button>
  );
}
