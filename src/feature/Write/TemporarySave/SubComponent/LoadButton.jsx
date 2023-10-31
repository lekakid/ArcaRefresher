import React, { useCallback } from 'react';
import { Button } from '@material-ui/core';
import { Publish } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';

import { setLoadOpen } from '../slice';
import Info from '../FeatureInfo';
import LoadTable from './LoadTable';

export default function LoadButton({ editor, ...btnProps }) {
  const dispatch = useDispatch();
  const { loadOpen } = useSelector((state) => state[Info.ID]);

  const handleClick = useCallback(() => {
    dispatch(setLoadOpen(true));
  }, [dispatch]);

  const handleClose = useCallback(() => {
    dispatch(setLoadOpen(false));
  }, [dispatch]);

  return (
    <>
      {React.cloneElement(
        <Button startIcon={<Publish />} onClick={handleClick}>
          불러오기
        </Button>,
        btnProps,
      )}
      <LoadTable editor={editor} open={loadOpen} onClose={handleClose} />
    </>
  );
}
