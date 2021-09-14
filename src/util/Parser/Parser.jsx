import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useElementQuery } from 'core/hooks';
import { BOARD_LOADED, BOARD_CATEGORIES, CHANNEL_TITLE } from 'core/selector';

import { setChannelID, setChannelName, setCategory } from './slice';

export default function Parser() {
  const dispatch = useDispatch();
  const boardLoaded = useElementQuery(BOARD_LOADED);

  useLayoutEffect(() => {
    if (!boardLoaded) return;

    const idRegex = /\/b\/([0-9a-zA-Z]{4,20})/;
    const { pathname } = window.location;
    const channelID = pathname.match(idRegex)?.[1]?.toLowerCase();
    dispatch(setChannelID(channelID));

    const channelName = document.querySelector(CHANNEL_TITLE)?.textContent;
    dispatch(setChannelName(channelName));

    const category = [...document.querySelectorAll(BOARD_CATEGORIES)].reduce(
      (acc, cur) => {
        if (cur.href.indexOf('category=') === -1)
          return { ...acc, 일반: '일반' };

        const id = decodeURI(cur.href.split('category=')[1].split('&')[0]);
        const text = cur.textContent;

        return { ...acc, [id]: text };
      },
      {},
    );
    dispatch(setCategory(category));
  }, [boardLoaded, dispatch]);

  return null;
}
