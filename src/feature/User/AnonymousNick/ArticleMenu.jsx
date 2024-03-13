import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { PeopleAltOutlined } from '@mui/icons-material';

import Info from './FeatureInfo';
import { toggleShow } from './slice';

export default function ArticleMenu() {
  const dispatch = useDispatch();
  const { show } = useSelector((state) => state[Info.id]);

  const handleToggle = useCallback(() => {
    dispatch(toggleShow());
  }, [dispatch]);

  return (
    <Button
      size="small"
      variant="text"
      startIcon={<PeopleAltOutlined />}
      onClick={handleToggle}
    >
      {show ? '익명화 해제' : '익명화'}
    </Button>
  );
}
