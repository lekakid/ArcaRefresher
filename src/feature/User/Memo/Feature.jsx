import React, { useLayoutEffect, useRef, useState } from 'react';
import { Portal } from '@mui/material';
import { useSelector } from 'react-redux';

import { FULL_LOADED, USER_INFO } from 'core/selector';
import { AuthorTag } from 'component';
import { EVENT_BOARD_REFRESH, EVENT_COMMENT_REFRESH } from 'core/event';
import { useLoadChecker } from 'hooks/LoadChecker';

import { User, getUserKey } from 'func/user';

import Info from './FeatureInfo';

function MemoList() {
  const loaded = useLoadChecker(FULL_LOADED);

  const { variant, memo } = useSelector((state) => state[Info.id].storage);
  const memoContainers = useRef([]);
  const [infoList, setInfoList] = useState([]);

  useLayoutEffect(() => {
    if (!loaded) return undefined;

    const appendMemo = () => {
      const list = [...document.querySelectorAll(USER_INFO)].map((e, index) => {
        const key = getUserKey(e, index);
        const id = new User(e).toUID();
        const container =
          memoContainers.current[index] || document.createElement('span');
        if (!container.classList.contains('memo')) {
          container.classList.add('memo');
          memoContainers.current.push(container);
        }
        e.append(container);

        return { key, id, container };
      });

      setInfoList(list);
    };
    appendMemo();
    window.addEventListener(EVENT_BOARD_REFRESH, appendMemo);
    window.addEventListener(EVENT_COMMENT_REFRESH, appendMemo);

    return () => {
      window.removeEventListener(EVENT_BOARD_REFRESH, appendMemo);
      window.removeEventListener(EVENT_COMMENT_REFRESH, appendMemo);
    };
  }, [loaded]);

  useLayoutEffect(() => {
    const colorizeUser = () => {
      [...document.querySelectorAll(USER_INFO)].forEach((e) => {
        const { id } = new User(e);

        if (memo[id]?.color) {
          e.style.setProperty('color', memo[id].color, 'important');
          e.style.setProperty('font-weight', 'bold');

          e.querySelector('a')?.style.setProperty(
            'color',
            memo[id].color,
            'important',
          );
        } else {
          e.style.removeProperty('color');
          e.style.removeProperty('font-weight');
          e.querySelector('a')?.style.removeProperty('color');
        }
      });
    };
    if (loaded) colorizeUser();
    window.addEventListener(EVENT_BOARD_REFRESH, colorizeUser);
    window.addEventListener(EVENT_COMMENT_REFRESH, colorizeUser);

    return () => {
      window.removeEventListener(EVENT_BOARD_REFRESH, colorizeUser);
      window.removeEventListener(EVENT_COMMENT_REFRESH, colorizeUser);
    };
  }, [memo, loaded]);

  if (variant === 'none') return null;
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
