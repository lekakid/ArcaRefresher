import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import { ARTICLE_LOADED, ARTICLE_USER_INFO } from 'core/selector';
import { useElementQuery } from 'core/hooks';
import { getUserInfo, getUserKey } from 'func/user';

import Info from './FeatureInfo';
import Label from './Label';

function getInfoList({ prefixList, suffixList, extraPrefix }) {
  const nickTable = {};
  const remainNickList = prefixList.reduce(
    (acc, p) => acc.concat(suffixList.map((s) => `${p} ${s}`)),
    [],
  );
  let extraCount = 0;

  const getAnonymousNick = (id) => {
    if (nickTable[id]) return nickTable[id];

    if (remainNickList.length === 0) {
      extraCount += 1;
      return `${extraPrefix}${`${extraCount}`.padStart(3, '0')}`;
    }
    [nickTable[id]] = remainNickList.splice(
      Math.floor(Math.random() * remainNickList.length),
      1,
    );
    return nickTable[id];
  };

  return [...document.querySelectorAll(ARTICLE_USER_INFO)].map((e, index) => {
    const key = getUserKey(e, index);
    const id = getUserInfo(e);
    const nick = getAnonymousNick(id);
    const container =
      e.querySelector('.anonymous') || document.createElement('span');
    if (!container.parentNode) {
      container.classList.add('anonymous');
      e.insertAdjacentElement('afterend', container);
    }

    return { key, nick, container };
  });
}

const useStyles = makeStyles(
  {
    AnonymousNick: {
      '& .article-wrapper': {
        '& .user-info, & .avatar': {
          display: 'none !important',
        },
      },
    },
  },
  { name: Info.ID },
);

export default function AnonymousNick() {
  const { storage, show } = useSelector((state) => state[Info.ID]);
  const [infoList, setInfoList] = useState([]);
  const articleLoaded = useElementQuery(ARTICLE_LOADED);

  const classes = useStyles();

  useEffect(() => {
    if (!articleLoaded) return;
    const updateInfoList = getInfoList(storage);
    setInfoList(updateInfoList);
  }, [articleLoaded, storage]);

  useEffect(() => {
    if (!show) return null;

    document.documentElement.classList.add(classes.AnonymousNick);

    return () =>
      document.documentElement.classList.remove(classes.AnonymousNick);
  }, [classes, show]);

  if (!show) return null;
  return (
    <>
      {infoList.map(({ key, nick, container }) => (
        <Label key={key} nick={nick} container={container} />
      ))}
    </>
  );
}
