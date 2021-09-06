import React, { useCallback, useState } from 'react';
import { Button } from '@material-ui/core';
import { Publish } from '@material-ui/icons';

import LoadTable from './LoadTable';

export default function LoadButton(btnProps) {
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      {React.cloneElement(
        <Button startIcon={<Publish />} onClick={handleClick}>
          불러오기
        </Button>,
        btnProps,
      )}
      <LoadTable open={open} onClose={handleClose} />
    </>
  );
}
