import React, { useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';

import {
  addAREvent,
  removeAREvent,
  EVENT_AUTOREFRESH,
  EVENT_COMMENT_REFRESH,
} from 'core/event';
import { AuthorTag } from 'component';
import { USER_INFO, FULL_LOADED } from 'core/selector';
import { useElementQuery } from 'core/hooks';
import { getUserID, getKey } from 'util/user';

import { MODULE_ID } from './ModuleInfo';

function MemoList() {
  const { memo } = useSelector((state) => state[MODULE_ID]);
  const [infoList, setInfoList] = useState([]);
  const loaded = useElementQuery(FULL_LOADED);

  useLayoutEffect(() => {
    const appendMemo = () => {
      const list = [...document.querySelectorAll(USER_INFO)].map((e, index) => {
        const key = getKey(e, index);
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
    if (loaded) appendMemo();
    addAREvent(EVENT_AUTOREFRESH, appendMemo);
    addAREvent(EVENT_COMMENT_REFRESH, appendMemo);

    return () => {
      removeAREvent(EVENT_AUTOREFRESH, appendMemo);
      removeAREvent(EVENT_COMMENT_REFRESH, appendMemo);
    };
  }, [loaded]);

  return (
    <>
      {infoList.map(({ key, id, container }) =>
        ReactDOM.createPortal(
          <AuthorTag key={key}>{memo[id]}</AuthorTag>,
          container,
        ),
      )}
    </>
  );
}

export default MemoList;
