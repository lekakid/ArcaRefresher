import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { GlobalStyles } from '@mui/material';

import { useArcaSocket } from 'hooks/WebSocket';
import { ArcaUser } from 'func/user';

import info from '../info';
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
  const { subscribeSocket, unsubscribeSocket } = useArcaSocket();

  const filter = useSelector(filterSelector);
  const { muteChannelPointAlarm, hideMutedMark, muteAllEmot } = useSelector(
    (state) => state[info.id].storage,
  );

  useEffect(() => {
    const modifier = (type, data) => {
      if (type !== 'n') return data;

      // 이모티콘 뮤트 처리
      if (data.mediaUrl) {
        const url = trimEmotURL(data.mediaUrl);
        if (muteAllEmot || filter.emoticon.url[url]) {
          if (hideMutedMark) return null;

          const { mediaUrl, title, message, ...rest } = data;

          return {
            ...rest,
            title: 'Arca Refresher',
            message: '[뮤트된 아카콘]',
          };
        }
      }

      // 사용자 뮤트
      const regex = new RegExp(filter.user.join('|') || '(?!)');
      if (data.username && regex.test(new ArcaUser(data.username).toUID())) {
        if (hideMutedMark) return null;

        const { mediaUrl, title, message, ...rest } = data;
        return {
          ...rest,
          title: 'Arca Refresher',
          message: '[뮤트된 이용자의 알림]',
        };
      }

      return data;
    };

    subscribeSocket(modifier);
    return () => unsubscribeSocket(modifier);
  }, [filter, hideMutedMark, muteAllEmot, subscribeSocket, unsubscribeSocket]);

  useEffect(() => {
    if (!muteChannelPointAlarm) return undefined;

    const modifier = (type, data) => (type === 'cp' ? null : data);

    subscribeSocket(modifier);
    return () => unsubscribeSocket(modifier);
  }, [muteChannelPointAlarm, subscribeSocket, unsubscribeSocket]);

  return toastMuteStyles;
}

export default ToastMuter;
