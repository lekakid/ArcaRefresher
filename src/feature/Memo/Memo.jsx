import React, { useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import uuid from 'react-uuid';

import {
  addAREvent,
  removeAREvent,
  EVENT_AUTOREFRESH,
  EVENT_COMMENT_REFRESH,
} from 'core/event';
import { AuthorLabel } from 'component';
import { USER_INFO } from 'core/selector';
import { getUserID } from 'util/user';

import { MODULE_ID } from './ModuleInfo';

function MemoList() {
  const { memo } = useSelector((state) => state[MODULE_ID]);
  const [infoList, setInfoList] = useState([]);

  useLayoutEffect(() => {
    const appendMemo = () => {
      const list = [...document.querySelectorAll(USER_INFO)].map((e) => {
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

      setInfoList(list);
    };
    window.addEventListener('load', appendMemo);
    addAREvent(EVENT_AUTOREFRESH, appendMemo);
    addAREvent(EVENT_COMMENT_REFRESH, appendMemo);

    return () => {
      window.removeEventListener('load', appendMemo);
      removeAREvent(EVENT_AUTOREFRESH, appendMemo);
      removeAREvent(EVENT_COMMENT_REFRESH, appendMemo);
    };
  }, []);

  return (
    <>
      {infoList.map(({ key, id, container }) =>
        ReactDOM.createPortal(
          <AuthorLabel key={key}>{memo[id]}</AuthorLabel>,
          container,
        ),
      )}
    </>
  );
}

export default MemoList;
