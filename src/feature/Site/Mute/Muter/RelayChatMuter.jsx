import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useArcaSocket } from 'core/WebSocket';
import { ArcaUser } from 'func/user';

import { filterSelector } from '../selector';
import info from '../info';

function RelayChatMuter() {
  const { subscribeSocket, unsubscribeSocket } = useArcaSocket();

  const filter = useSelector(filterSelector);
  const { hideMutedMark } = useSelector((state) => state[info.id].storage);

  useEffect(() => {
    const modifier = (type, data) => {
      // 채팅이 아니거나 데이터가 없는 경우
      if (type !== 'nc' || !data) return data;

      const user = data.nickname.split('data-filter="')[1].split('"')[0];

      /*
      // TODO 이모티콘 뮤트 처리
      // data.type = 'image', data.content = URL
      */

      // 사용자 뮤트
      const regex = new RegExp(filter.user.join('|') || '(?!)');
      if (regex.test(new ArcaUser(user).toUID())) {
        if (hideMutedMark) return null;

        return {
          ...data,
          content: '[채팅 뮤트됨]',
        };
      }

      return data;
    };

    subscribeSocket(modifier);
    return () => unsubscribeSocket(modifier);
  }, [filter, hideMutedMark, subscribeSocket, unsubscribeSocket]);

  return null;
}

export default RelayChatMuter;
