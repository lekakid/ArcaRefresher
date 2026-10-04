import { useLayoutEffect, useRef, useState } from 'react';
import { Box, Portal } from '@mui/material';
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

import MemoInput from './MemoInput';
import Info from './FeatureInfo';
import { $updateMemoNick, setInputUser } from './slice';

function MemoList() {
  const dispatch = useDispatch();
  const loaded = useLoadChecker(FULL_LOADED);

  const { variant, memo } = useSelector((state) => state[Info.id].storage);

  const memoContainers = useRef([]);
  const [infoList, setInfoList] = useState([]);

  // 렌더 컨테이너 생성
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

  // 1페이지 한정 마지막으로 사용한 닉네임 갱신
  useLayoutEffect(() => {
    if (!loaded) return;

    const search = new URLSearchParams(window.location.search);
    const targetKeys = ['after', 'before', 'near'];

    const isKeywordSearch = targetKeys.some((key) => search.has(key));
    if (isKeywordSearch) return;

    const page = parseInt(search.get('p'), 10);
    if (page > 1) return;

    const dupTable = {};

    [...document.querySelectorAll(USER_INFO_WITHOUT_NOTICE)].forEach((e) => {
      const user = new ArcaUser(e);
      const { nick } = user;
      const id = user.toUID();

      if (!dupTable[id] && memo[id] && memo[id].nick !== nick) {
        dispatch($updateMemoNick({ user: id, nick }));
      }
      // 이미 갱신처리한 이용자의 갱신 처리 방지
      dupTable[id] = true;
    });
  }, [loaded, memo, dispatch]);

  // 메모 색상 처리
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
          <Box
            component="span"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setInputUser(id));
            }}
          >
            <AuthorTag variant={variant}>{memo[id]?.msg}</AuthorTag>
          </Box>
        </Portal>
      ))}
      <MemoInput />
    </>
  );
}

export default MemoList;
