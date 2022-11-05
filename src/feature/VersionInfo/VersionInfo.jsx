import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, Snackbar } from '@material-ui/core';
import { Close } from '@material-ui/icons';

import Info from './FeatureInfo';
import { $updateCheckedVersion } from './slice';

function parse(versionString) {
  const token = versionString.split('.');
  return {
    major: Number(token[0]),
    minor: Number(token[1]),
    patch: Number(token[2]),
  };
}

/**
 * 적용 중인 스크립트 버전과 마지막으로 확인한 버전을 비교합니다.
 *
 * @param {string} script  적용 중인 스크립트 버전 스트링
 * @param {string} storage  마지막으로 확인한 버전 스트링
 * @returns                 값이 양수라면 업데이트 확인 필요, 음수라면 새로고침이 필요함
 */
function compare(script, storage) {
  const scriptVersion = parse(script);
  const storageVersion = parse(storage);

  if (scriptVersion.major !== storageVersion.major) {
    return scriptVersion.major - storageVersion.major;
  }
  if (scriptVersion.minor !== storageVersion.minor) {
    return scriptVersion.minor - storageVersion.minor;
  }
  return scriptVersion.patch - storageVersion.patch;
}

export default function VersionInfo() {
  const dispatch = useDispatch();
  const {
    storage: { checkedVersion },
  } = useSelector((state) => state[Info.ID]);
  const [noti, setNoti] = useState({
    open: false,
    refresh: false,
    once: false
  });

  useEffect(() => {
    const result = compare(GM_info.script.version, checkedVersion);
    setNoti({
      open: result !== 0,
      refresh: result < 0,
      once: result >= 2
    });
  }, [checkedVersion]);

  const handleChangeLog = useCallback(() => {
    window.open(
      `https://arca.live/b/namurefresher?category=%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8${noti.once ? "" : `&target=title&keyword=${GM_info.script.version}`}`,
    );
    setNoti((prev) => ({
      ...prev,
      open: false,
    }));
    dispatch($updateCheckedVersion(GM_info.script.version));
  }, [dispatch, noti]);

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  const handleClose = useCallback(() => {
    setNoti((prev) => ({
      ...prev,
      open: false,
    }));
    dispatch($updateCheckedVersion(GM_info.script.version));
  }, [dispatch]);

  let message = '';
  let action;
  if (noti.refresh) {
    message =
      '이 탭에 업데이트 된 스크립트를 적용하려면 새로고침이 필요합니다.';
    action = (
      <Button size="small" color="inherit" onClick={handleRefresh}>
        <Box fontWeight="fontWeightBold">새로고침</Box>
      </Button>
    );
  } else {
    message = '리프레셔가 업데이트 되었습니다.';
    action = (
      <>
        <Button size="small" color="inherit" onClick={handleChangeLog}>
          <Box fontWeight="fontWeightBold">업데이트 내역</Box>
        </Button>
        <IconButton size="small" color="inherit" onClick={handleClose}>
          <Close fontSize="small" />
        </IconButton>
      </>
    );
  }

  return (
    <Snackbar
      open={noti.open}
      onClose={handleClose}
      message={message}
      ClickAwayListenerProps={{
        mouseEvent: false,
      }}
      action={action}
    />
  );
}
