import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { GlobalStyles } from '@mui/material';

import {
  BOARD_NOTICES,
  BOARD_ITEMS,
  BOARD_LOADED,
  BOARD,
  BOARD_IN_ARTICLE,
} from 'core/selector';
import { EVENT_BOARD_REFRESH } from 'core/event';
import { useLoadChecker } from 'hooks/LoadChecker';

import Info from './FeatureInfo';

/* eslint-disable react/prop-types */
function UserInfoWidthStyles({ value }) {
  return (
    <GlobalStyles
      styles={{
        '.vcol.col-author': {
          width: `calc(7rem * (1 + ${value * 0.01})) !important`,
        },
      }}
    />
  );
}

function RateCount({ value }) {
  if (value) return null;

  return (
    <GlobalStyles
      styles={{
        'html body.body .board-article .article-list .list-table': {
          '& .vrow-inner .vrow-bottom .vcol.col-view': {
            '&::after': {
              content: '""',
              margin: 0,
            },
            marginRight: 0,
          },
          '& .vcol.col-rate': {
            display: 'none !important',
          },
        },
      }}
    />
  );
}
/* eslint-enable react/prop-types */

export default function BoardCustom() {
  const boardLoaded = useLoadChecker(BOARD_LOADED);

  const {
    // 모양
    userinfoWidth,
    rateCount,
    // 동작
    openArticleNewWindow,
    enhancedArticleManage,
  } = useSelector((state) => state[Info.id].storage);

  // 게시판 새 창 열기 방지
  useEffect(() => {
    if (!boardLoaded || !openArticleNewWindow) return null;

    const board = document.querySelector(`${BOARD}, ${BOARD_IN_ARTICLE}`);
    const applyNewWindow = () => {
      const articles = board.querySelectorAll(
        `${BOARD_NOTICES}, ${BOARD_ITEMS}`,
      );
      articles.forEach((a) => {
        a.setAttribute('target', '_blank');
      });
    };

    applyNewWindow();
    window.addEventListener(EVENT_BOARD_REFRESH, applyNewWindow);
    return () => {
      const articles = board.querySelectorAll(
        `${BOARD_NOTICES}, ${BOARD_ITEMS}`,
      );
      articles.forEach((a) => {
        a.setAttribute('target', '');
      });

      window.removeEventListener(EVENT_BOARD_REFRESH, applyNewWindow);
    };
  }, [boardLoaded, openArticleNewWindow]);

  // 게시물 관리 UX 개선
  useEffect(() => {
    if (!boardLoaded) return undefined;
    if (!enhancedArticleManage) return undefined;
    if (!document.querySelector('.article-list.admin')) return undefined;

    const board = document.querySelector(BOARD);
    let selectedElement;
    let value = false;
    let dragged = false;

    const dragStartHandler = (e) => {
      if (e.button !== 0) return;

      const row = e.target.closest('a.vrow:not(.notice)');
      if (!row) return;

      selectedElement = row;
      const check = row.querySelector('input[type="checkbox"]');
      value = !check.checked;
    };
    const dragEndHandler = (e) => {
      if (e.button !== 0) return;

      selectedElement = undefined;
    };
    const clickHandler = (e) => {
      if (e.target.matches('input[type="checkbox"]')) return;
      if (dragged) {
        e.preventDefault();
        dragged = false;
      }

      const row = e.target.closest('a.vrow:not(.notice)');
      if (!row) return;

      if (e.pageX < row.offsetLeft + 35 && e.pageY < row.offsetTop + 35) {
        e.preventDefault();
        const check = row.querySelector('input[type="checkbox"]');
        if (check.checked !== value) {
          check.click();
        }
      }
    };
    const draggingHandler = (e) => {
      if (!selectedElement) return;
      e.preventDefault();

      const row = e.target.closest('a.vrow:not(.notice)');
      if (!row || selectedElement === row) return;

      const selectedCheck = selectedElement.querySelector(
        'input[type="checkbox"]',
      );
      if (selectedCheck.checked !== value) {
        selectedCheck.click();
        dragged = true;
      }

      const check = row.querySelector('input[type="checkbox"]');
      if (check.checked !== value) {
        check.click();
      }
    };
    board.addEventListener('click', clickHandler);
    board.addEventListener('mousedown', dragStartHandler);
    board.addEventListener('mouseup', dragEndHandler);
    board.addEventListener('mousemove', draggingHandler);
    return () => {
      board.addEventListener('click', clickHandler);
      board.removeEventListener('mousedown', dragStartHandler);
      board.addEventListener('mouseup', dragEndHandler);
      board.addEventListener('mousemove', draggingHandler);
    };
  }, [boardLoaded, enhancedArticleManage]);

  return (
    <>
      <UserInfoWidthStyles value={userinfoWidth} />
      <RateCount value={rateCount} />
    </>
  );
}
