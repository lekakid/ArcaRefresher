import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import {
  BOARD_ARTICLES_WITHOUT_NOTICE,
  BOARD_LOADED,
  BOARD_VIEW,
} from '../$Common/Selector';
import useElementQuery from '../$Common/useElementQuery';
import { addAREvent, EVENT_AUTOREFRESH, removeAREvent } from '../$Common/Event';
import { getCategory, getChannelID, getUserInfo } from '../$Common/Parser';

import { MODULE_ID } from './ModuleInfo';
import { setChannelID } from './slice';
import CountBar from './CountBar';
import filterContent from './filterContent';

const useStyles = makeStyles(() => ({
  '@global': {
    '.body .article-list .frontend-header': {
      display: 'none',
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
  const { user, keyword, channelID, categoryConfig, hideCountBar } =
    useSelector((state) => state[MODULE_ID]);
  const [board, setBoard] = useState(null);
  const [categoryPair, setCategoryPair] = useState(null);
  const [countBar, setCountBar] = useState(null);
  const [count, setCount] = useState({});
  const [btnState, setBtnState] = useState({});

  const classes = useStyles();

  useEffect(() => {
    if (!boardLoaded) return;

    const tmpBoard = document.querySelector(BOARD_VIEW);
    if (!tmpBoard) return;

    setBoard(tmpBoard);
    dispatch(setChannelID(getChannelID()));
    setCategoryPair(getCategory());

    const countHeader = document.createElement('div');
    countHeader.classList.add(classes.root);
    tmpBoard.insertAdjacentElement('afterbegin', countHeader);
    setCountBar(countHeader);
  }, [classes, dispatch, boardLoaded]);

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
        category: a.querySelector('.badge')?.textContent || '',
      }));

      const result = filterContent(
        articleInfo,
        user,
        keyword,
        categoryConfig[channelID],
        categoryPair,
      );
      setCount(result);
      setBtnState(
        Object.keys(result).reduce((acc, cur) => ({ ...acc, [cur]: false })),
      );
    };

    if (document.readyState === 'complete') muteArticle();
    window.addEventListener('load', muteArticle);
    addAREvent(EVENT_AUTOREFRESH, muteArticle);

    return () => {
      window.removeEventListener('load', muteArticle);
      removeAREvent(EVENT_AUTOREFRESH, muteArticle);
    };
  }, [board, categoryConfig, categoryPair, channelID, keyword, user]);

  const handleClick = useCallback(
    (key) => () => {
      const suffix = key === 'all' ? '' : `-${key}`;
      const className = `show-filtered${suffix}`;
      board.classList.toggle(className);
      setBtnState((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    },
    [board],
  );

  if (!boardLoaded || !countBar) return null;
  if (hideCountBar || count.all === 0) return null;

  return (
    <CountBar
      container={countBar}
      count={count}
      btnState={btnState}
      onClick={handleClick}
    />
  );
}
