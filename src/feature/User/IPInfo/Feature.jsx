import React, { useEffect, useRef, useState } from 'react';
import { Portal } from '@mui/material';

import { AuthorTag } from 'component';
import { FULL_LOADED, USER_INFO } from 'core/selector';
import { EVENT_BOARD_REFRESH, EVENT_COMMENT_REFRESH } from 'core/event';
import { useLoadChecker } from 'hooks/LoadChecker';
import { User, getUserKey } from 'func/user';

import DB from './ip';

export default function IPInfo() {
  const loaded = useLoadChecker(FULL_LOADED);

  const infoContainer = useRef([]);
  const [infoList, setInfoList] = useState([]);

  useEffect(() => {
    const refreshUserInfo = () => {
      const list = [...document.querySelectorAll(USER_INFO)]
        .map((e, index) => {
          const user = new User(e);
          if (user.type !== User.TYPE_IP) return null;

          const key = getUserKey(e, index);
          const ip = new User(e).id;

          const { label, color } = Object.values(DB).find(({ list: ipList }) =>
            ipList.includes(ip),
          ) || { label: '고정', color: 'green' };

          const container =
            infoContainer.current[index] || document.createElement('span');
          if (!container.classList.contains('ip-info')) {
            container.classList.add('ip-info');
            infoContainer.current.push(container);
          }
          e.append(container);

          return { key, label, color, container };
        })
        .filter((e) => e);

      setInfoList(list);
    };
    if (loaded) refreshUserInfo();
    window.addEventListener(EVENT_BOARD_REFRESH, refreshUserInfo);
    window.addEventListener(EVENT_COMMENT_REFRESH, refreshUserInfo);
  }, [loaded]);

  return (
    <>
      {infoList.map(({ key, label, color, container }) => (
        <Portal key={key} container={container}>
          <AuthorTag color={color}>{label}</AuthorTag>
        </Portal>
      ))}
    </>
  );
}
