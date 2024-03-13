import React, { useEffect, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { GlobalStyles } from '@mui/material';

import { COMMENT_USER_INFO, FULL_LOADED, USER_INFO } from 'core/selector';
import { EVENT_BOARD_REFRESH, EVENT_COMMENT_REFRESH } from 'core/event';
import { useContent } from 'hooks/Content';
import { useLoadChecker } from 'hooks/LoadChecker';
import { getUserNick } from 'func/user';

import Info from './FeatureInfo';

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
  const loaded = useLoadChecker(FULL_LOADED);
  const { user } = useContent();

  const { indicateMyComment, showId } = useSelector(
    (state) => state[Info.id].storage,
  );

  useLayoutEffect(() => {
    if (!loaded) return undefined;
    if (!showId) return undefined;

    const show = () => {
      [...document.querySelectorAll(USER_INFO)].forEach((e) => {
        const fullNick = getUserNick(e);
        if (!fullNick.includes('#')) return;

        e.firstElementChild.textContent = fullNick;
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

  useEffect(() => {
    if (!indicateMyComment) return undefined;
    if (!user) return undefined;

    const apply = () => {
      [...document.querySelectorAll(COMMENT_USER_INFO)].forEach((e) => {
        if (getUserNick(e) === user.id) {
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

  return profileStyles;
}

export default UserProfile;
