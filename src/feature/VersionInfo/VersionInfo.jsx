import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, Snackbar } from '@material-ui/core';
import { Close } from '@material-ui/icons';

import Info from './FeatureInfo';
import { $updateCheckedVersion } from './slice';

export default function VersionInfo() {
  const dispatch = useDispatch();
  const {
    storage: { checkedVersion },
  } = useSelector((state) => state[Info.ID]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (checkedVersion !== GM_info.script.version) {
      setOpen(true);
    }
  }, [checkedVersion]);

  const handleChangeLog = useCallback(() => {
    window.open(
      'https://arca.live/b/namurefresher?category=%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8',
    );
    setOpen(false);
    dispatch($updateCheckedVersion());
  }, [dispatch]);

  const handleClose = useCallback(() => {
    setOpen(false);
    dispatch($updateCheckedVersion());
  }, [dispatch]);

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      message="리프레셔가 업데이트 되었습니다."
      ClickAwayListenerProps={{
        mouseEvent: false,
      }}
      action={
        <>
          <Button size="small" color="inherit" onClick={handleChangeLog}>
            <Box fontWeight="fontWeightBold">업데이트 내역</Box>
          </Button>
          <IconButton size="small" color="inherit" onClick={handleClose}>
            <Close fontSize="small" />
          </IconButton>
        </>
      }
    />
  );
}
