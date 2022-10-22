import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import { GetApp } from '@material-ui/icons';

import Info from './FeatureInfo';
import { setOpen } from './slice';

export default function ArticleMenu() {
  const dispatch = useDispatch();
  const { open } = useSelector((state) => state[Info.ID]);

  const handleOpen = useCallback(() => {
    dispatch(setOpen(true));
  }, [dispatch]);

  return (
    <Button
      size="small"
      startIcon={<GetApp />}
      onClick={handleOpen}
      disabled={open}
    >
      이미지 다운로더
    </Button>
  );
}
