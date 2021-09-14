import React, { useEffect, useState } from 'react';
import uuid from 'react-uuid';

import {
  addAREvent,
  EVENT_AUTOREFRESH,
  EVENT_COMMENT_REFRESH,
} from 'core/event';
import { USER_INFO } from 'core/selector';
import { getUserIP } from 'util/user';
import Info from './Info';

function getUserInfo() {
  return [...document.querySelectorAll(USER_INFO)].map((e) => {
    const key = e.dataset.key || uuid();
    // eslint-disable-next-line no-param-reassign
    if (!e.dataset.key) e.dataset.key = key;
    const ip = getUserIP(e);
    const container =
      e.querySelector('.ip-info') || document.createElement('span');
    if (!container.parentNode) {
      container.classList.add('ip-info');
      e.append(container);
    }

    return { key, ip, container };
  });
}

export default function InfoList() {
  const [infoList, setInfoList] = useState([]);

  useEffect(() => {
    const refreshUserInfo = () => {
      setInfoList(getUserInfo());
    };
    window.addEventListener('load', refreshUserInfo);
    addAREvent(EVENT_AUTOREFRESH, refreshUserInfo);
    addAREvent(EVENT_COMMENT_REFRESH, refreshUserInfo);
  }, []);

  return (
    <>
      {infoList.map(({ key, ip, container }) => (
        <Info key={key} ip={ip} container={container} />
      ))}
    </>
  );
}
