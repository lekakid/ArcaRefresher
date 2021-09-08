import React, { useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import uuid from 'react-uuid';

import {
  addAREvent,
  EVENT_AUTOREFRESH,
  EVENT_COMMENT_REFRESH,
} from 'core/event';
import { USER_INFO } from 'core/selector';
import { getUserID } from 'util/parser';

import { MODULE_ID } from './ModuleInfo';
import Label from './Label';

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
  const { memo } = useSelector((state) => state[MODULE_ID]);
  const [infoList, setInfoList] = useState([]);

  useLayoutEffect(() => {
    const appendMemo = () => {
      setInfoList(getUserInfo());
    };
    window.addEventListener('load', appendMemo);
    addAREvent(EVENT_AUTOREFRESH, appendMemo);
    addAREvent(EVENT_COMMENT_REFRESH, appendMemo);
  }, []);

  return (
    <>
      {infoList.map(({ key, id, container }) =>
        ReactDOM.createPortal(<Label key={key} memo={memo[id]} />, container),
      )}
    </>
  );
}
