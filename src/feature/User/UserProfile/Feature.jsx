import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  addAREvent,
  EVENT_AUTOREFRESH,
  EVENT_COMMENT_REFRESH,
  removeAREvent,
} from 'core/event';
import { FULL_LOADED, USER_INFO } from 'core/selector';
import { useLoadChecker } from 'hooks';
import { getUserNick } from 'func/user';

import Info from './FeatureInfo';

function UserProfile() {
  const {
    storage: { showId },
  } = useSelector((state) => state[Info.ID]);
  const loaded = useLoadChecker(FULL_LOADED);

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
    addAREvent(EVENT_AUTOREFRESH, show);
    addAREvent(EVENT_COMMENT_REFRESH, show);

    return () => {
      [...document.querySelectorAll(USER_INFO)].forEach((e) => {
        const [hiddenID] = e.firstChild.textContent.split('#');
        e.firstChild.textContent = hiddenID;
      });
      removeAREvent(EVENT_AUTOREFRESH, show);
      removeAREvent(EVENT_COMMENT_REFRESH, show);
    };
  }, [loaded, showId]);

  return null;
}

export default UserProfile;
