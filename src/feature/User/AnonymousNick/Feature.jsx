import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GlobalStyles } from '@mui/material';

import { ARTICLE_LOADED, ARTICLE_USER_INFO } from 'core/selector';
import { getUserID, getUserKey } from 'func/user';
import { useLoadChecker } from 'hooks/LoadChecker';

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
  const { storage, show } = useSelector((state) => state[Info.ID]);
  const [nickData, setNickData] = useState([]);
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);

  useEffect(() => {
    if (!articleLoaded) return;

    const nickList = storage.prefixList.reduce((acc, p) => {
      acc.push(...storage.suffixList.map((s) => `${p} ${s}`));
      return acc;
    }, []);
    nickList.sort(() => Math.random() - 0.5);

    let count = 0;
    const nickTable = {};
    const data = [...document.querySelectorAll(ARTICLE_USER_INFO)].map(
      (e, index) => {
        const key = getUserKey(e, index);
        const id = getUserID(e);
        const nick =
          nickTable[id] ||
          (nickTable[id] =
            nickList.pop() ||
            `${storage.extraPrefix}${String((count += 1)).padStart(3, '0')}`);
        const container =
          e.querySelector('.anonymous') || document.createElement('span');
        if (!container.parentNode) {
          container.classList.add('anonymous');
          e.insertAdjacentElement('afterend', container);
        }

        return { key, nick, container };
      },
    );
    setNickData(data);
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
