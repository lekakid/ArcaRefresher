import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import uuid from 'react-uuid';
import { makeStyles } from '@material-ui/core';

import { ARTICLE_LOADED, ARTICLE_USER_INFO } from '../$Common/Selector';
import { getUserInfo } from '../$Common/Parser';
import useElementQuery from '../$Common/useElementQuery';

import { MODULE_ID } from './ModuleInfo';
import AnonymousNick from './AnonymousNick';

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

  return [...document.querySelectorAll(ARTICLE_USER_INFO)].map((e) => {
    const key = e.dataset.key || uuid();
    // eslint-disable-next-line no-param-reassign
    if (!e.dataset.key) e.dataset.key = key;
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

const useStyles = makeStyles(() => ({
  'anonymous-nick': {
    '& .article-wrapper': {
      '& .user-info, & .avatar': {
        display: 'none !important',
      },
    },
  },
}));

export default function VirtualContainer() {
  const config = useSelector((state) => state[MODULE_ID]);
  const [infoList, setInfoList] = useState([]);
  const articleLoaded = useElementQuery(ARTICLE_LOADED);

  const classes = useStyles();

  useEffect(() => {
    if (articleLoaded) setInfoList(getInfoList(config));
  }, [articleLoaded, config]);

  useEffect(() => {
    if (config.show) {
      document.documentElement.classList.add(classes['anonymous-nick']);
    }

    return () =>
      document.documentElement.classList.remove(classes['anonymous-nick']);
  }, [classes, config.show]);

  return (
    <>
      {infoList.map(({ key, nick, container }) => (
        <AnonymousNick
          key={key}
          show={config.show}
          nick={nick}
          container={container}
        />
      ))}
    </>
  );
}
