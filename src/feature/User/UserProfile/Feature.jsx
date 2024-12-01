import { useEffect, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { GlobalStyles } from '@mui/material';

import { COMMENT_USER_INFO, FULL_LOADED, USER_INFO } from 'core/selector';
import { EVENT_BOARD_REFRESH, EVENT_COMMENT_REFRESH } from 'core/event';
import { useContent } from 'hooks/Content';
import { useLoadChecker } from 'hooks/LoadChecker';
import { ArcaUser } from 'func/user';

import { useArcaSocket } from 'hooks/WebSocket';
import Info from './FeatureInfo';

/* eslint-disable react/prop-types */

function AvatarStyles({ value }) {
  if (value) return null;

  return (
    <GlobalStyles
      styles={{
        '.avatar': {
          display: 'none !important',
        },
        '.input-wrapper > .input': {
          width: 'calc(100% - 5rem) !important',
        },
      }}
    />
  );
}

/* eslint-enable react/prop-types */

const profileStyles = (
  <GlobalStyles
    styles={{
      '.mynick': {
        fontWeight: 'bold',
      },
    }}
  />
);

function UserProfile() {
  const [subscribeSocket, unsubscribeSocket] = useArcaSocket();
  const loaded = useLoadChecker(FULL_LOADED);
  const { user } = useContent();

  const { showId, avatar, indicateMyComment } = useSelector(
    (state) => state[Info.id].storage,
  );

  // 반고닉 고유번호 표시
  useLayoutEffect(() => {
    if (!loaded) return undefined;
    if (!showId) return undefined;

    const show = () => {
      [...document.querySelectorAll(USER_INFO)].forEach((e) => {
        const u = new ArcaUser(e);
        if (u.type !== ArcaUser.TYPE_HALF) return;

        e.firstElementChild.textContent = `${
          e.firstElementChild.textContent.includes('@') ? '@' : ''
        }${u.toString()}`;
      });
    };
    show();
    window.addEventListener(EVENT_BOARD_REFRESH, show);
    window.addEventListener(EVENT_COMMENT_REFRESH, show);

    return () => {
      [...document.querySelectorAll(USER_INFO)].forEach((e) => {
        const [nick] = e.firstElementChild.textContent.split('#');
        e.firstElementChild.textContent = nick;
      });
      window.removeEventListener(EVENT_BOARD_REFRESH, show);
      window.removeEventListener(EVENT_COMMENT_REFRESH, show);
    };
  }, [loaded, showId]);

  // 알림 반고닉 표기 처리
  useEffect(() => {
    if (!showId) return undefined;

    const callback = (e) => {
      const data = e.data.split('|');
      if (data[0] !== 'n') return;

      const noti = JSON.parse(data[1]);

      const [nick, id] = noti.username.split('#');
      if (id) {
        if (noti.mediaUrl) {
          noti.title = noti.title.replace(nick, noti.username);
        }
        noti.message = noti.message.replace(nick, noti.username);
      }

      e.data = `${data[0]}|${JSON.stringify(noti)}`;
    };
    const subscriber = { callback, type: 'before' };
    subscribeSocket(subscriber);

    return () => unsubscribeSocket(subscriber);
  }, [showId, subscribeSocket, unsubscribeSocket]);

  // 동시시청 반고닉 표기 처리
  useEffect(() => {
    if (!showId) return undefined;

    const callback = (e) => {
      const data = e.data.split('|');
      if (data[0] !== 'nc') return;

      const chat = JSON.parse(data[1]);

      const filter = chat.nickname.split('data-filter="')[1].split('"')[0];
      if (filter.indexOf('#') === -1) return;

      chat.nickname = chat.nickname.replace(/">[^>]+<\/a>/, `">${filter}</a>`);
      e.data = `${data[0]}|${JSON.stringify(chat)}`;
    };
    const subscriber = { callback, type: 'before' };
    subscribeSocket(subscriber);

    return () => unsubscribeSocket(subscriber);
  }, [showId, subscribeSocket, unsubscribeSocket]);

  // 자신이 작성한 댓글 표시
  useEffect(() => {
    if (!indicateMyComment) return undefined;
    if (!user) return undefined;

    const apply = () => {
      [...document.querySelectorAll(COMMENT_USER_INFO)].forEach((e) => {
        if (new ArcaUser(e).id === user.id) {
          e.classList.add('mynick');
        }
      });
    };

    apply();
    window.addEventListener(EVENT_COMMENT_REFRESH, apply);

    return () => {
      [...document.querySelectorAll(COMMENT_USER_INFO)].forEach((e) => {
        e.classList.remove('mynick');
      });
      window.removeEventListener(EVENT_COMMENT_REFRESH, apply);
    };
  }, [user, indicateMyComment]);

  return (
    <>
      {profileStyles}
      <AvatarStyles value={avatar} />
    </>
  );
}

export default UserProfile;
