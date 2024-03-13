import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { GetApp } from '@mui/icons-material';

import Info from './FeatureInfo';
import { setOpen } from './slice';

export default function ArticleMenu() {
  const dispatch = useDispatch();
  const { open } = useSelector((state) => state[Info.id]);

  const handleOpen = useCallback(() => {
    dispatch(setOpen(true));
  }, [dispatch]);

  return (
    <Button
      size="small"
      variant="text"
      startIcon={<GetApp />}
      onClick={handleOpen}
      disabled={open}
    >
      이미지 다운로더
    </Button>
  );
}
