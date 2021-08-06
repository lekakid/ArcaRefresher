import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import uuid from 'react-uuid';

import {
  addAREvent,
  EVENT_AUTOREFRESH,
  EVENT_COMMENT_REFRESH,
} from '../$Common/Event';
import { getUserIP } from '../$Common/Parser';
import { USER_INFO } from '../$Common/Selector';
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

export default function VirtualContainer() {
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
      {infoList.map(({ key, ip, container }) =>
        ReactDOM.createPortal(<Info key={key} ip={ip} />, container),
      )}
    </>
  );
}
