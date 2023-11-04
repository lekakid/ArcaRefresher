import React, { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/styles';

import {
  BOARD_LOADED,
  BOARD,
  BOARD_IN_ARTICLE,
  BOARD_ITEMS,
} from 'core/selector';
import { EVENT_BOARD_REFRESH, useEvent } from 'hooks/Event';
import { useLoadChecker } from 'hooks';
import { useContent } from 'hooks/Content';
import { getUserInfo } from 'func/user';

import CountBar from './CountBar';
import { filterContent, trimEmotURL } from '../func';
import { emoticonFilterSelector } from '../selector';
import Info from '../FeatureInfo';

const style = {
  '@global': {
    '.body .article-list': {
      '& .frontend-header': {
        display: 'none',
      },
      '& .list-table.show-filtered-category .filtered-category': {
        display: 'flex !important',
      },
      '& .block-preview .vrow-preview': {
        display: 'none !important',
      },
      '& .filtered-emoticon': {
        display: 'none !important',
      },
    },
    '.hide-service-notice .notice-service': {
      display: 'none !important',
    },
    '.hide-no-permission .vrow[href$="#c_"]': {
      display: 'none !important',
    },
    '.hide-closed-deal .vrow.ar-closed': {
      display: 'none !important',
    },
  },
};

function BoardMuter() {
  const dispatch = useDispatch();
  const [addEventListener, removeEventListener] = useEvent();
  const boardLoaded = useLoadChecker(BOARD_LOADED);

  const { channel, board } = useContent();
  const {
    user,
    keyword,
    category,
    boardBarPos,
    hideCountBar,
    hideServiceNotice,
    hideNoPermission,
    hideClosedDeal,
  } = useSelector((state) => state[Info.ID].storage);
  const [boardContainer, setBoardContainer] = useState(undefined);
  const [nameToIDMap, setNameToIDMap] = useState(undefined);
  const [container, setContainer] = useState(undefined);
  const [count, setCount] = useState(undefined);
  const emoticionFilter = useSelector(emoticonFilterSelector);

  // 카테고리 매핑 테이블
  useLayoutEffect(() => {
    if (!boardLoaded) return;
    if (!board) return;

    const boardElement = document.querySelector(
      `${BOARD}, ${BOARD_IN_ARTICLE}`,
    );
    if (!boardElement) return;

    setBoardContainer(boardElement);
    const name2id = Object.fromEntries(
      Object.entries(board.category).map(([key, value]) => [value, key]),
    );
    setNameToIDMap(name2id);

    const containerElement = document.createElement('div');
    setContainer(containerElement);
  }, [dispatch, boardLoaded, board]);

  useLayoutEffect(() => {
    if (!boardContainer) return;

    boardContainer.insertAdjacentElement(boardBarPos, container);
    boardContainer.style.marginBottom = boardBarPos === 'afterend' ? '0' : '';
  }, [boardContainer, container, boardBarPos]);

  // 유저, 키워드, 카테고리 뮤트처리
  useLayoutEffect(() => {
    if (!boardContainer) return undefined;

    const muteArticle = () => {
      const articleList = [...boardContainer.querySelectorAll(BOARD_ITEMS)];
      const articleInfo = articleList
        .filter((a) => !a.href?.includes('#c_'))
        .map((a) => ({
          element: a,
          user: getUserInfo(a.querySelector('.user-info')),
          content: a.querySelector('.title')?.textContent || '',
          category: a.querySelector('.badge')?.textContent || '글머리없음',
        }));
      const channelCategory = category[channel.ID] || {};

      const result = filterContent({
        contents: articleInfo,
        userList: user,
        keywordList: keyword,
        categoryList: channelCategory,
        categoryMap: nameToIDMap,
      });
      setCount(result);
    };

    if (document.readyState === 'complete') muteArticle();
    window.addEventListener('load', muteArticle);
    addEventListener(EVENT_BOARD_REFRESH, muteArticle);

    return () => {
      window.removeEventListener('load', muteArticle);
      removeEventListener(EVENT_BOARD_REFRESH, muteArticle);
    };
  }, [
    boardContainer,
    nameToIDMap,
    keyword,
    user,
    channel,
    category,
    addEventListener,
    removeEventListener,
  ]);

  // 게시물 미리보기 뮤트
  useLayoutEffect(() => {
    if (!boardContainer) return;

    const images = boardContainer.querySelectorAll(
      '.vrow-preview noscript, .vrow-preview img',
    );
    images.forEach((e) => {
      const url = e.matches('img')
        ? trimEmotURL(e.src)
        : trimEmotURL(e.textContent.match(/(\/\/.+)type=list/g)[0]);

      if (emoticionFilter.url[url]) {
        e.parentNode.classList.add('filtered-emoticon');
      }
    });
  }, [boardContainer, emoticionFilter]);

  // 서비스 공지사항
  useLayoutEffect(() => {
    document.documentElement.classList.toggle(
      'hide-service-notice',
      hideServiceNotice,
    );
  }, [hideServiceNotice]);

  // (권한 없음) 게시물
  useLayoutEffect(() => {
    document.documentElement.classList.toggle(
      'hide-no-permission',
      hideNoPermission,
    );
  }, [hideNoPermission]);

  // [핫딜 채널] 식은딜 게시물
  useLayoutEffect(() => {
    if (!boardContainer) return;

    const articleList = [...boardContainer.querySelectorAll(BOARD_ITEMS)];
    articleList
      .filter((a) => a.querySelector('.deal-close'))
      .forEach((a) => a.classList.add('ar-closed'));
    document.documentElement.classList.toggle(
      'hide-closed-deal',
      hideClosedDeal,
    );
  }, [boardContainer, hideClosedDeal]);

  if (!container) return null;
  return (
    <CountBar
      renderContainer={container}
      classContainer={boardContainer}
      count={count}
      hide={hideCountBar}
    />
  );
}

export default withStyles(style)(BoardMuter);
