import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import uuid from 'react-uuid';

import {
  addAREvent,
  EVENT_AUTOREFRESH,
  EVENT_COMMENT_REFRESH,
} from '../$Common/Event';
import { getUserID } from '../$Common/Parser';
import { USER_INFO } from '../$Common/Selector';
import Memo from './Memo';

function getUserInfo() {
  return [...document.querySelectorAll(USER_INFO)].map((e) => {
    const key = e.dataset.key || uuid();
    // eslint-disable-next-line no-param-reassign
    if (!e.dataset.key) e.dataset.key = key;
    const id = getUserID(e);
    const container =
      e.querySelector('.memo') || document.createElement('span');
    if (!container.parentNode) {
      container.classList.add('memo');
      e.append(container);
    }

    return { key, id, container };
  });
}

export default function MemoList() {
  const { memo } = useSelector((state) => state.Memo);
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
      {infoList.map(({ key, id, container }) =>
        ReactDOM.createPortal(<Memo key={key} memo={memo[id]} />, container),
      )}
    </>
  );
}
