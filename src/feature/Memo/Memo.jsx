import React, { useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';

import {
  addAREvent,
  removeAREvent,
  EVENT_AUTOREFRESH,
  EVENT_COMMENT_REFRESH,
} from 'core/event';
import { AuthorLabel } from 'component';
import { USER_INFO, FULL_LOADED } from 'core/selector';
import { useElementQuery } from 'core/hooks';
import { getUserID } from 'util/user';

import { MODULE_ID } from './ModuleInfo';

function getKey(element, index) {
  const comment = element.closest('div.comment-wrapper');
  if (comment) return comment.id;

  const article = element.closest('a.vrow');
  if (article) return `a_${article.pathname.split('/')[3]}`;

  return `$.${index}`;
}

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
          <AuthorLabel key={key}>{memo[id]}</AuthorLabel>,
          container,
        ),
      )}
    </>
  );
}

export default MemoList;
