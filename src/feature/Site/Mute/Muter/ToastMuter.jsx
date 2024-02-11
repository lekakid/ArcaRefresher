import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { GlobalStyles } from '@mui/material';

import { useArcaSocket } from 'hooks/WebSocket';

import Info from '../FeatureInfo';
import { trimEmotURL } from '../func';
import { filterSelector } from '../selector';

const toastMuteStyles = (
  <GlobalStyles
    styles={{
      '#toastbox': {
        '& .filtered-emoticon': {
          width: 'auto !important',
          height: 'auto !important',
          textDecoration: 'none !important',
          '&::after': {
            content: '"[아카콘 뮤트됨]"',
          },
          '& > img, & > video': {
            display: 'none !important',
          },
        },
      },
    }}
  />
);

function ToastMuter() {
  const [subscribeSocket, unsubscribeSocket] = useArcaSocket();

  const filter = useSelector(filterSelector);
  const { hideMutedMark, muteAllEmot } = useSelector(
    (state) => state[Info.ID].storage,
  );

  useEffect(() => {
    const callback = (e) => {
      const data = e.data.split('|');
      if (data[0] !== 'n') return;

      const noti = JSON.parse(data[1]);

      // 이모티콘 뮤트 처리
      if (noti.mediaUrl) {
        const url = trimEmotURL(noti.mediaUrl);
        if (muteAllEmot || filter.emoticon.url[url]) {
          if (hideMutedMark) {
            Object.defineProperty(e, 'ignore', { value: true });
            return;
          }

          delete noti.mediaUrl;
          noti.title = 'Arca Refresher';
          noti.message = '[뮤트된 아카콘]';
        }
      }

      // 사용자 뮤트
      const regex =
        filter.user.length > 0 ? new RegExp(filter.user.join('|')) : undefined;
      if (regex?.test(noti.username)) {
        if (hideMutedMark) {
          Object.defineProperty(e, 'ignore', { value: true });
          return;
        }

        if (noti.mediaUrl) delete noti.mediaUrl;
        noti.title = 'Arca Refresher';
        noti.message = '[뮤트된 이용자의 알림]';
      }

      const injectedData = `${data[0]}|${JSON.stringify(noti)}`;
      Object.defineProperty(e, 'data', { value: injectedData });
    };
    const subscriber = { callback, type: 'before' };
    subscribeSocket(subscriber);

    return () => unsubscribeSocket(subscriber);
  }, [filter, hideMutedMark, muteAllEmot, subscribeSocket, unsubscribeSocket]);

  return toastMuteStyles;
}

export default ToastMuter;
