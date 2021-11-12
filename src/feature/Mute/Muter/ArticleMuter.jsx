import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import {
  BOARD_ARTICLES_WITHOUT_NOTICE,
  BOARD_LOADED,
  BOARD_VIEW,
} from 'core/selector';
import { useElementQuery } from 'core/hooks';
import { addAREvent, EVENT_AUTOREFRESH, removeAREvent } from 'core/event';
import { useParser } from 'util/Parser';
import { getUserInfo } from 'util/user';

import { filterContent } from '../func';
import { MODULE_ID } from '../ModuleInfo';
import CountBar from './CountBar';

const useStyles = makeStyles(() => ({
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
    },
  },
  root: {
    '&:empty': {
      display: 'none',
    },
    borderBottom: '1px solid var(--color-border-outer)',
  },
}));

export default function ArticleMuter() {
  const dispatch = useDispatch();
  const boardLoaded = useElementQuery(BOARD_LOADED);
  const { channelID, category: categoryInfo } = useParser();
  const { user, keyword, category, hideCountBar } = useSelector(
    (state) => state[MODULE_ID],
  );
  const [board, setBoard] = useState(null);
  const [nameToIDMap, setNameToIDMap] = useState(null);
  const [countBar, setCountBar] = useState(null);
  const [count, setCount] = useState(null);

  const classes = useStyles();

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
    countHeader.classList.add(classes.root);
    tmpBoard.insertAdjacentElement('afterbegin', countHeader);
    setCountBar(countHeader);
  }, [classes, dispatch, boardLoaded, categoryInfo]);

  useEffect(() => {
    if (!board) return null;

    const muteArticle = () => {
      const articleList = [
        ...board.querySelectorAll(BOARD_ARTICLES_WITHOUT_NOTICE),
      ];
      const articleInfo = articleList.map((a) => ({
        element: a,
        user: getUserInfo(a.querySelector('.user-info')),
        content: a.querySelector('.title')?.textContent || '',
        category: a.querySelector('.badge')?.textContent || '일반',
      }));
      const categoryConfig = category[channelID] || {};

      const result = filterContent(
        articleInfo,
        user,
        keyword,
        categoryConfig,
        nameToIDMap,
      );
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

  if (!countBar || hideCountBar) return null;
  return (
    <CountBar renderContainer={countBar} classContainer={board} count={count} />
  );
}
