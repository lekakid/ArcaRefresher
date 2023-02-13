import React, { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/styles';

import {
  BOARD_LOADED,
  BOARD,
  BOARD_IN_ARTICLE,
  BOARD_ITEMS,
} from 'core/selector';
import { addAREvent, EVENT_AUTOREFRESH, removeAREvent } from 'core/event';
import { useContent } from 'util/ContentInfo';
import { useLoadChecker } from 'util/LoadChecker';
import { getUserInfo } from 'func/user';

import Info from '../FeatureInfo';
import { filterContent } from '../func';
import { emoticonFilterSelector } from '../selector';
import CountBar from './CountBar';

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
    '.hide-no-permission a.vrow[href$="#c_"]': {
      display: 'none !important',
    },
  },
};

function BoardMuter() {
  const dispatch = useDispatch();
  const boardLoaded = useLoadChecker(BOARD_LOADED);
  const { channel } = useContent();
  const {
    storage: {
      user,
      keyword,
      category,
      boardBarPos,
      hideCountBar,
      hideServiceNotice,
      hideNoPermission,
    },
  } = useSelector((state) => state[Info.ID]);
  const [board, setBoard] = useState(undefined);
  const [nameToIDMap, setNameToIDMap] = useState(undefined);
  const [container, setContainer] = useState(undefined);
  const [count, setCount] = useState(undefined);
  const emoticionFilter = useSelector(emoticonFilterSelector);

  // 카테고리 매핑 테이블
  useLayoutEffect(() => {
    if (!boardLoaded) return;
    if (!channel.category) return;

    const boardElement = document.querySelector(
      `${BOARD}, ${BOARD_IN_ARTICLE}`,
    );
    if (!boardElement) return;

    setBoard(boardElement);
    const name2id = Object.fromEntries(
      Object.entries(channel.category).map(([key, value]) => [value, key]),
    );
    setNameToIDMap(name2id);

    const containerElement = document.createElement('div');
    setContainer(containerElement);
  }, [dispatch, boardLoaded, channel]);

  useLayoutEffect(() => {
    if (!board) return;

    board.insertAdjacentElement(boardBarPos, container);
    board.style.marginBottom = boardBarPos === 'afterend' ? '0' : '';
  }, [board, container, boardBarPos]);

  // 유저, 키워드, 카테고리 뮤트처리
  useLayoutEffect(() => {
    if (!board) return undefined;

    const muteArticle = () => {
      const articleList = [...board.querySelectorAll(BOARD_ITEMS)];
      const articleInfo = articleList
        .filter((a) => !a.href.includes('#c_'))
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
    addAREvent(EVENT_AUTOREFRESH, muteArticle);

    return () => {
      window.removeEventListener('load', muteArticle);
      removeAREvent(EVENT_AUTOREFRESH, muteArticle);
    };
  }, [board, nameToIDMap, keyword, user, channel, category]);

  // 게시물 미리보기 뮤트
  useLayoutEffect(() => {
    if (!board) return;

    const images = board.querySelectorAll(
      '.vrow-preview noscript, .vrow-preview img',
    );
    images.forEach((e) => {
      const url = e.matches('img')
        ? e.src.replace('https:', '').replace('?type=list', '')
        : e.textContent
            .match(/(\/\/.+)?type=list/g)[0]
            .replace('?type=list', '');

      if (emoticionFilter.url.indexOf(url) > -1) {
        e.parentNode.classList.add('filtered-emoticon');
      }
    });
  }, [board, emoticionFilter]);

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

  if (!container) return null;
  return (
    <CountBar
      renderContainer={container}
      classContainer={board}
      count={count}
      hide={hideCountBar}
    />
  );
}

export default withStyles(style)(BoardMuter);
