import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useArcaSocket } from 'hooks/WebSocket';

import { filterSelector } from '../selector';
import info from '../info';

function RelayChatMuter() {
  const [subscribeSocket, unsubscribeSocket] = useArcaSocket();

  const filter = useSelector(filterSelector);
  const { hideMutedMark } = useSelector((state) => state[info.id].storage);

  useEffect(() => {
    const callback = (e) => {
      const data = e.data.split('|');
      if (data[0] !== 'nc' || !data[1]) return;

      const chat = JSON.parse(data[1]);
      const dataFilter = chat.nickname.split('data-filter="')[1].split('"')[0];

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
  }, [filter, hideMutedMark, subscribeSocket, unsubscribeSocket]);

  return null;
}

export default RelayChatMuter;
