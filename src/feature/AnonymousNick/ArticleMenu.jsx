import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import { PeopleAltOutlined } from '@material-ui/icons';

import { MODULE_ID } from './ModuleInfo';
import { toggleShow } from './slice';

export default function ArticleMenu() {
  const dispatch = useDispatch();
  const { show } = useSelector((state) => state[MODULE_ID]);

  const handleToggle = useCallback(() => {
    dispatch(toggleShow());
  }, [dispatch]);

  return (
    <Button
      size="small"
      startIcon={<PeopleAltOutlined />}
      onClick={handleToggle}
    >
      {show ? '익명화 해제' : '익명화'}
    </Button>
  );
}
