import { useEffect, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';

import store from 'store';
import {
  BOARD_NOTICES,
  BOARD_ITEMS,
  BOARD_LOADED,
  BOARD,
  BOARD_IN_ARTICLE,
} from 'constants/selector';
import { EVENT_BOARD_REFRESH } from 'constants/event';
import { useLoadChecker } from 'core/LoadChecker';

import info from './info';

const styleEl = document.createElement('style');
document.body.append(styleEl);

function applyStyle(storage) {
  const { userinfoWidth, rateCount } = storage;

  const styles = [];

  // 게시판 이용자 너비 설정
  styles.push(`
    .vcol.col-author {
      width: calc(7rem * (1 + ${userinfoWidth * 0.01})) !important;
    }
  `);

  // 추천 수 표시 제거
  if (!rateCount) {
    styles.push(`
      body .board-article .vrow-inner .vcol.col-view:after { content: "" !important; }
      body .board-article .vrow-inner .vcol.col-rate { display: none !important; }
    `);
  }

  styleEl.textContent = styles.join('\n\n');
}
applyStyle(store.getState()[info.id].storage);

export default function BoardCustom() {
  const boardLoaded = useLoadChecker(BOARD_LOADED);

  const {
    // 동작
    openArticleNewWindow,
    enhancedArticleManage,
    ...storage
  } = useSelector((state) => state[info.id].storage);

  // 레이아웃 스타일 적용
  useLayoutEffect(() => {
    applyStyle(storage);
  }, [storage]);

  // 게시판 새 창 열기 방지
  useEffect(() => {
    if (!boardLoaded || !openArticleNewWindow) return undefined;

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
    const downHandler = (e) => {
      if (e.button !== 0) return;

      const row = e.target.closest('a.vrow:not(.notice)');
      if (!row) return;

      e.preventDefault();
      selectedElement = row;
      const check = row.querySelector('input[type="checkbox"]');
      value = !check.checked;
    };
    const upHandler = (e) => {
      if (e.button !== 0) return;

      e.preventDefault();
      selectedElement = undefined;
    };
    const moveHandler = (e) => {
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
    board.addEventListener('mousedown', downHandler);
    board.addEventListener('mouseup', upHandler);
    board.addEventListener('mousemove', moveHandler);
    return () => {
      board.removeEventListener('click', clickHandler);
      board.removeEventListener('mousedown', downHandler);
      board.removeEventListener('mouseup', upHandler);
      board.removeEventListener('mousemove', moveHandler);
    };
  }, [boardLoaded, enhancedArticleManage]);

  // 운영 경고 팝업 시 게시물 링크 처리
  useEffect(() => {
    const linkify = () => {
      const dialogContent = document.querySelector(
        '.microModal .microModal-content',
      );
      if (!dialogContent) return;

      dialogContent.innerHTML = dialogContent.innerHTML.replace(
        /https:\/\/arca\.live\/b\/[a-z0-9]+\/[0-9]+/g,
        (url) =>
          `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`,
      );
    };

    if (document.readyState === 'complete') {
      linkify();
      return undefined;
    }

    window.addEventListener('load', linkify);
    return () => window.removeEventListener('load', linkify);
  }, []);

  return null;
}
