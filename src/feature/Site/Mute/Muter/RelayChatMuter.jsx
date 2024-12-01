import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { GlobalStyles } from '@mui/material';

import { useArcaSocket } from 'hooks/WebSocket';

import Info from '../FeatureInfo';
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
    (state) => state[Info.id].storage,
  );

  useEffect(() => {
    const callback = (e) => {
      const data = e.data.split('|');
      if (data[0] !== 'nc') return;

      const chat = JSON.parse(data[1]);
      const dataFilter = chat.nickname.split('data-filter="')[1].split('"')[0];

      /*
      // 이모티콘 뮤트 처리
      // 데이터 확보가 어려워서 기회가 되면 나중에
      if (chat.mediaUrl) {
        const url = trimEmotURL(chat.mediaUrl);
        if (muteAllEmot || filter.emoticon.url[url]) {
          if (hideMutedMark) {
            e.ignore = true;
            return;
          }

          delete chat.mediaUrl;
          chat.content = '[아카콘 뮤트됨]';
        }
      }
      */

      // 사용자 뮤트
      const regex =
        filter.user.length > 0 ? new RegExp(filter.user.join('|')) : undefined;
      if (regex?.test(dataFilter)) {
        if (hideMutedMark) {
          e.ignore = true;
          return;
        }

        chat.content = '[채팅 뮤트됨]';
      }

      e.data = `${data[0]}|${JSON.stringify(chat)}`;
    };
    const subscriber = { callback, type: 'before' };
    subscribeSocket(subscriber);

    return () => unsubscribeSocket(subscriber);
  }, [filter, hideMutedMark, muteAllEmot, subscribeSocket, unsubscribeSocket]);

  return toastMuteStyles;
}

export default ToastMuter;
