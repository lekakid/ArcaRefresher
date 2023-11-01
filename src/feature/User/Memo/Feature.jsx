import React, { useLayoutEffect, useState } from 'react';
import { Portal } from '@material-ui/core';
import { useSelector } from 'react-redux';

import { FULL_LOADED, USER_INFO } from 'core/selector';
import { AuthorTag } from 'component';
import {
  EVENT_BOARD_REFRESH,
  EVENT_COMMENT_REFRESH,
  useEvent,
} from 'hooks/Event';
import { useLoadChecker } from 'hooks';

import { getUserID, getUserKey } from 'func/user';

import Info from './FeatureInfo';

function MemoList() {
  const [addEventListener, removeEventListener] = useEvent();
  const loaded = useLoadChecker(FULL_LOADED);

  const { variant, memo } = useSelector((state) => state[Info.ID].storage);
  const [infoList, setInfoList] = useState([]);

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
    addEventListener(EVENT_BOARD_REFRESH, appendMemo);
    addEventListener(EVENT_COMMENT_REFRESH, appendMemo);

    return () => {
      removeEventListener(EVENT_BOARD_REFRESH, appendMemo);
      removeEventListener(EVENT_COMMENT_REFRESH, appendMemo);
    };
  }, [loaded, addEventListener, removeEventListener]);

  useLayoutEffect(() => {
    const colorizeUser = () => {
      [...document.querySelectorAll(USER_INFO)].forEach((e) => {
        const id = getUserID(e);

        if (memo[id]?.color) {
          e.style.setProperty('color', memo[id].color, 'important');
          e.style.setProperty('font-weight', 'bold');

          e.querySelector('a')?.style.setProperty(
            'color',
            memo[id].color,
            'important',
          );
        } else {
          e.style.setProperty('color', '');
          e.style.setProperty('font-weight', '');
          e.querySelector('a')?.style.setProperty('color', '');
        }
      });
    };
    if (loaded) colorizeUser();
    addEventListener(EVENT_BOARD_REFRESH, colorizeUser);
    addEventListener(EVENT_COMMENT_REFRESH, colorizeUser);

    return () => {
      removeEventListener(EVENT_BOARD_REFRESH, colorizeUser);
      removeEventListener(EVENT_COMMENT_REFRESH, colorizeUser);
    };
  }, [memo, loaded, addEventListener, removeEventListener]);

  return (
    <>
      {infoList.map(({ key, id, container }) => (
        <Portal key={key} container={container}>
          <AuthorTag variant={variant}>{memo[id]?.msg}</AuthorTag>
        </Portal>
      ))}
    </>
  );
}

export default MemoList;
