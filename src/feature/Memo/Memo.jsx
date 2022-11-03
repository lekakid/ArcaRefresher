import React, { useLayoutEffect, useState } from 'react';
import { Portal } from '@material-ui/core';
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
import { getUserID, getUserKey } from 'func/user';

import Info from './FeatureInfo';

function MemoList() {
  const {
    storage: { variant, memo },
  } = useSelector((state) => state[Info.ID]);
  const [infoList, setInfoList] = useState([]);
  const loaded = useElementQuery(FULL_LOADED);

  useLayoutEffect(() => {
    const appendMemo = () => {
      const list = [...document.querySelectorAll(USER_INFO)].map((e, index) => {
        const key = getUserKey(e, index);
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
      {infoList.map(({ key, id, container }) => (
        <Portal key={key} container={container}>
          <AuthorTag variant={variant}>{memo[id]}</AuthorTag>
        </Portal>
      ))}
    </>
  );
}

export default MemoList;
