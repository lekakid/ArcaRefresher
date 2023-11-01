import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';

import { FULL_LOADED, USER_INFO } from 'core/selector';
import {
  EVENT_BOARD_REFRESH,
  EVENT_COMMENT_REFRESH,
  useEvent,
} from 'hooks/Event';
import { useLoadChecker } from 'hooks';
import { getUserNick } from 'func/user';

import Info from './FeatureInfo';

function UserProfile() {
  const [addEventListener, removeEventListener] = useEvent();
  const loaded = useLoadChecker(FULL_LOADED);

  const { showId } = useSelector((state) => state[Info.ID].storage);

  useLayoutEffect(() => {
    if (!loaded) return undefined;
    if (!showId) return undefined;

    const show = () => {
      [...document.querySelectorAll(USER_INFO)].forEach((e) => {
        if (!getUserNick(e).includes('#')) return;

        e.firstChild.textContent = e.firstChild.dataset.filter;
      });
    };
    show();
    addEventListener(EVENT_BOARD_REFRESH, show);
    addEventListener(EVENT_COMMENT_REFRESH, show);

    return () => {
      [...document.querySelectorAll(USER_INFO)].forEach((e) => {
        const [hiddenID] = e.firstChild.textContent.split('#');
        e.firstChild.textContent = hiddenID;
      });
      removeEventListener(EVENT_BOARD_REFRESH, show);
      removeEventListener(EVENT_COMMENT_REFRESH, show);
    };
  }, [loaded, showId, addEventListener, removeEventListener]);

  return null;
}

export default UserProfile;
