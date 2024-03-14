import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { GlobalStyles } from '@mui/material';

import { ARTICLE_LOADED, ARTICLE_USER_INFO } from 'core/selector';
import { ArcaUser, getUserKey } from 'func/user';
import { useLoadChecker } from 'hooks/LoadChecker';

import { EVENT_COMMENT_REFRESH } from 'core/event';
import Info from './FeatureInfo';
import Label from './Label';

const anonymousNickStyles = (
  <GlobalStyles
    styles={{
      '.article-wrapper': {
        '& .user-info, & .avatar': {
          display: 'none !important',
        },
      },
    }}
  />
);

function AnonymousNick() {
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);

  const { storage, show } = useSelector((state) => state[Info.id]);
  const nickContainer = useRef([]);
  const [nickData, setNickData] = useState([]);

  useEffect(() => {
    if (!articleLoaded) return undefined;

    const nickList = storage.prefixList.reduce((acc, p) => {
      acc.push(...storage.suffixList.map((s) => `${p} ${s}`));
      return acc;
    }, []);
    nickList.sort(() => Math.random() - 0.5);
    const nickTable = {};

    const handler = () => {
      let count = 0;
      const data = [...document.querySelectorAll(ARTICLE_USER_INFO)].map(
        (e, index) => {
          const key = getUserKey(e, index);
          const id = new ArcaUser(e).toUID();
          const anonymousNick =
            nickTable[id] ||
            (nickTable[id] =
              nickList.pop() ||
              `${storage.extraPrefix}${String((count += 1)).padStart(3, '0')}`);
          const container =
            nickContainer.current[index] || document.createElement('span');
          if (!container.classList.contains('anonymous')) {
            container.classList.add('anonymous');
            nickContainer.current.push(container);
          }
          e.insertAdjacentElement('afterend', container);

          return { key, nick: anonymousNick, container };
        },
      );
      setNickData(data);
    };
    handler();
    window.addEventListener(EVENT_COMMENT_REFRESH, handler);

    return () => {
      window.removeEventListener(EVENT_COMMENT_REFRESH, handler);
    };
  }, [articleLoaded, storage]);

  if (!show) return null;
  return (
    <>
      {anonymousNickStyles}
      {nickData.map(({ key, nick, container }) => (
        <Label key={key} container={container}>
          {nick}
        </Label>
      ))}
    </>
  );
}

export default AnonymousNick;
