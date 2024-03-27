import { useLayoutEffect, useRef, useState } from 'react';
import { Portal } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import {
  FULL_LOADED,
  USER_INFO,
  USER_INFO_WITHOUT_NOTICE,
} from 'core/selector';
import { AuthorTag } from 'component';
import { EVENT_BOARD_REFRESH, EVENT_COMMENT_REFRESH } from 'core/event';
import { useLoadChecker } from 'hooks/LoadChecker';

import { ArcaUser, getUserKey } from 'func/user';

import { getQuery } from 'func/http';
import Info from './FeatureInfo';
import { $updateMemoNick } from './slice';

function MemoList() {
  const dispatch = useDispatch();
  const loaded = useLoadChecker(FULL_LOADED);

  const { variant, memo } = useSelector((state) => state[Info.id].storage);

  const memoContainers = useRef([]);
  const [infoList, setInfoList] = useState([]);

  useLayoutEffect(() => {
    if (!loaded) return undefined;

    const parse = () => {
      const list = [...document.querySelectorAll(USER_INFO)].map((e, index) => {
        const key = getUserKey(e, index);
        const user = new ArcaUser(e);
        const id = user.toUID();
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
    parse();
    window.addEventListener(EVENT_BOARD_REFRESH, parse);
    window.addEventListener(EVENT_COMMENT_REFRESH, parse);

    return () => {
      window.removeEventListener(EVENT_BOARD_REFRESH, parse);
      window.removeEventListener(EVENT_COMMENT_REFRESH, parse);
    };
  }, [loaded]);

  useLayoutEffect(() => {
    if (!loaded) return;

    const search = getQuery(window.location.search);
    const searchKeys = Object.keys(search);
    const targetKeys = ['after', 'before', 'near'];
    const page = parseInt(search.p, 10);
    const isKeywordSearch = searchKeys.some((key) => targetKeys.includes(key));
    if (page > 1) return;
    if (isKeywordSearch) return;

    [...document.querySelectorAll(USER_INFO_WITHOUT_NOTICE)].forEach((e) => {
      const user = new ArcaUser(e);
      const { nick } = user;
      const id = user.toUID();

      if (memo[id] && memo[id].nick !== nick) {
        dispatch($updateMemoNick({ user: id, nick }));
      }
    });
  }, [loaded, memo, dispatch]);

  useLayoutEffect(() => {
    const colorizeUser = () => {
      [...document.querySelectorAll(USER_INFO)].forEach((e) => {
        const id = new ArcaUser(e).toUID();

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
