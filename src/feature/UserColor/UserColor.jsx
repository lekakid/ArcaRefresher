import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  addAREvent,
  EVENT_AUTOREFRESH,
  EVENT_COMMENT_REFRESH,
  removeAREvent,
} from 'core/event';
import { USER_INFO, FULL_LOADED } from 'core/selector';
import { useElementQuery } from 'core/hooks';
import { getUserID } from 'func/user';

import Info from './FeatureInfo';

export default function Colorize() {
  const {
    storage: { color },
  } = useSelector((state) => state[Info.ID]);
  const loaded = useElementQuery(FULL_LOADED);

  useLayoutEffect(() => {
    const colorizeUser = () => {
      [...document.querySelectorAll(USER_INFO)].forEach((e) => {
        const id = getUserID(e);

        if (color[id]) {
          e.style.setProperty('color', color[id], 'important');
          e.style.setProperty('font-weight', 'bold');

          // eslint-disable-next-line no-unused-expressions
          e.querySelector('a')?.style.setProperty(
            'color',
            color[id],
            'important',
          );
        } else {
          e.style.setProperty('color', '');
          e.style.setProperty('font-weight', '');
          // eslint-disable-next-line no-unused-expressions
          e.querySelector('a')?.style.setProperty('color', '');
        }
      });
    };
    if (loaded) colorizeUser();
    addAREvent(EVENT_AUTOREFRESH, colorizeUser);
    addAREvent(EVENT_COMMENT_REFRESH, colorizeUser);

    return () => {
      removeAREvent(EVENT_AUTOREFRESH, colorizeUser);
      removeAREvent(EVENT_COMMENT_REFRESH, colorizeUser);
    };
  }, [color, loaded]);

  return null;
}
