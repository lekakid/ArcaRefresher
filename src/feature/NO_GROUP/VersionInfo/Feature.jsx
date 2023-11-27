import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, Snackbar } from '@mui/material';
import { Close } from '@mui/icons-material';

import { disableStorageSync } from 'core/storage';

import Info from './FeatureInfo';
import { $setCheckedVersion } from './slice';
import { parse, compare, join } from './func';

const MODE_UPGRADE = 1;
const MODE_DOWNGRADE = -1;
const MODE_DISABLE_STORAGE = -2;

export default function VersionInfo() {
  const dispatch = useDispatch();
  const { checkedVersion } = useSelector((state) => state[Info.ID].storage);
  const [boradcastChannel, setBroadcastChannel] = useState(null);
  const [noti, setNoti] = useState({
    open: false,
    mode: 0,
  });

  // 브로드캐스트 채널 생성
  useEffect(() => {
    const bc = new BroadcastChannel(`AR_${Info.ID}`);
    setBroadcastChannel(bc);
  }, []);

  useEffect(() => {
    if (!boradcastChannel) return;

    boradcastChannel.onmessage = ({ data }) => {
      if (data.msg === 'disable_storage') {
        disableStorageSync();
        setNoti({ open: true, mode: MODE_DISABLE_STORAGE });
      }
    };
  }, [boradcastChannel, dispatch]);

  useEffect(() => {
    if (!boradcastChannel) return;

    const diff = compare(GM_info.script.version, checkedVersion);
    if (diff < 0) {
      setNoti({ open: true, mode: MODE_DOWNGRADE });
    }
    if (diff > 0) {
      setNoti({ open: true, mode: MODE_UPGRADE });
    }
    if (diff !== 0) {
      // 다른 탭들의 데이터 저장 방지
      boradcastChannel.postMessage({ msg: 'disable_storage' });
    }
  }, [boradcastChannel, checkedVersion, dispatch]);

  const handleChangeLog = useCallback(() => {
    const url =
      'https://arca.live/b/namurefresher?category=%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8&target=title&keyword=';
    const version = parse(GM_info.script.version);
    version.patch = '*';
    GM_openInTab(`${url}${join(version)}`);
    setNoti({ open: false, mode: 0 });
    dispatch($setCheckedVersion(GM_info.script.version));
  }, [dispatch]);

  const handleDowngrade = useCallback(() => {
    dispatch($setCheckedVersion(GM_info.script.version));
    setNoti({ open: false, mode: 0 });
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  const handleClose = useCallback(() => {
    setNoti({ open: false, mode: 0 });
    dispatch($setCheckedVersion(GM_info.script.version));
  }, [dispatch]);

  let message = '';
  let action;
  switch (noti.mode) {
    case MODE_UPGRADE: {
      message = '리프레셔가 업데이트 되었습니다.';
      action = (
        <>
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={handleChangeLog}
          >
            <Box sx={{ fontWeight: 'bold' }}>업데이트 내역</Box>
          </Button>
          <IconButton size="small" color="inherit" onClick={handleClose}>
            <Close fontSize="small" />
          </IconButton>
        </>
      );
      break;
    }
    case MODE_DOWNGRADE: {
      message = '리프레셔를 다운그레이드 하셨나요?';
      action = (
        <Button
          size="small"
          variant="text"
          color="inherit"
          onClick={handleDowngrade}
        >
          <Box sx={{ fontWeight: 'bold' }}>예</Box>
        </Button>
      );
      break;
    }
    case MODE_DISABLE_STORAGE: {
      message = `이 탭의 스크립트 버전이 맞지 않습니다.
        이 탭에서 변경한 설정, 메모 등이 저장되지 않습니다.`;
      action = (
        <Button
          size="small"
          variant="text"
          color="inherit"
          onClick={handleRefresh}
        >
          <Box sx={{ fontWeight: 'bold' }}>새로고침</Box>
        </Button>
      );
      break;
    }
    default:
      break;
  }

  return (
    <Snackbar
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      open={noti.open}
      message={message}
      ClickAwayListenerProps={{
        mouseEvent: false,
      }}
      action={action}
    />
  );
}
