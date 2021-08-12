import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import { Publish } from '@material-ui/icons';

import { toggleLoadDialog } from './slice';
import ArticleTable from './ArticleTable';

export default function LoadButton() {
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(toggleLoadDialog());
  }, [dispatch]);

  return (
    <>
      <Button startIcon={<Publish />} onClick={handleClick}>
        불러오기
      </Button>
      <ArticleTable />
    </>
  );
}
