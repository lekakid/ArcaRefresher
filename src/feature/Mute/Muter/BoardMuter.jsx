import React, { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/styles';

import {
  BOARD_ARTICLES_WITHOUT_NOTICE,
  BOARD_LOADED,
  BOARD_VIEW,
} from 'core/selector';
import { useElementQuery } from 'core/hooks';
import { addAREvent, EVENT_AUTOREFRESH, removeAREvent } from 'core/event';
import { useParser } from 'util/Parser';
import { getUserInfo } from 'util/user';
import getBadgeText from 'util/badge';

import { filterContent } from '../func';
import { MODULE_ID } from '../ModuleInfo';
import CountBar from './CountBar';
import useEmoticon from './useEmoticon';

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
  },
};

function BoardMuter() {
  const dispatch = useDispatch();
  const boardLoaded = useElementQuery(BOARD_LOADED);
  const { channelID, category: categoryInfo } = useParser();
  const { user, keyword, emoticon, category, hideCountBar } = useSelector(
    (state) => state[MODULE_ID],
  );
  const [board, setBoard] = useState(undefined);
  const [nameToIDMap, setNameToIDMap] = useState(undefined);
  const [countBar, setCountBar] = useState(undefined);
  const [count, setCount] = useState(undefined);
  const emoticionFilter = useEmoticon(emoticon);

  // 카테고리 매핑 테이블
  useLayoutEffect(() => {
    if (!boardLoaded) return;
    if (!categoryInfo) return;

    const tmpBoard = document.querySelector(BOARD_VIEW);
    if (!tmpBoard) return;

    setBoard(tmpBoard);
    const name2id = Object.fromEntries(
      Object.entries(categoryInfo).map(([key, value]) => [value, key]),
    );
    setNameToIDMap(name2id);

    const countHeader = document.createElement('div');
    tmpBoard.insertAdjacentElement('afterbegin', countHeader);
    setCountBar(countHeader);
  }, [dispatch, boardLoaded, categoryInfo]);

  // 유저, 키워드, 카테고리 뮤트처리
  useLayoutEffect(() => {
    if (!board) return undefined;

    const muteArticle = () => {
      const articleList = [
        ...board.querySelectorAll(BOARD_ARTICLES_WITHOUT_NOTICE),
      ];
      const articleInfo = articleList.map((a) => ({
        element: a,
        user: getUserInfo(a.querySelector('.user-info')),
        content: a.querySelector('.title')?.textContent || '',
        category: getBadgeText(a.querySelector('.badge')) || '일반',
      }));
      const categoryConfig = category[channelID] || {};

      const result = filterContent({
        contents: articleInfo,
        userList: user,
        keywordList: keyword,
        categoryList: categoryConfig,
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
  }, [board, nameToIDMap, keyword, user, categoryInfo, channelID, category]);

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

  if (!countBar) return null;
  return (
    <CountBar
      renderContainer={countBar}
      classContainer={board}
      count={count}
      hide={hideCountBar}
    />
  );
}

export default withStyles(style)(BoardMuter);
