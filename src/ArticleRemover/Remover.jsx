import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import {
  ARTICLE_DELETE_FORM,
  BOARD_LOADED,
  BOARD_VIEW_WITHOUT_ARTICLE,
} from '../$Common/Selector';
import { EVENT_AUTOREFRESH } from '../$Common/Event';
import useElementQuery from '../$Common/useElementQuery';

import { remove, test } from './article';

const useStyles = makeStyles(() => ({
  target: {
    textDecorationLine: 'line-through',
    color: '#bbb',
  },
}));

export default function Remover() {
  const { users, keywords, testMode } = useSelector(
    (state) => state.ArticleRemover,
  );
  const [boardView, setBoardView] = useState(null);
  const boardLoaded = useElementQuery(BOARD_LOADED);

  const classes = useStyles();

  useEffect(() => {
    if (boardLoaded && document.querySelector(ARTICLE_DELETE_FORM))
      setBoardView(document.querySelector(BOARD_VIEW_WITHOUT_ARTICLE));
  }, [boardLoaded]);

  useEffect(() => {
    if (!boardView) return null;

    const onEvent = () => {
      if (testMode) test(boardView, users, keywords, classes);
      else remove(boardView, users, keywords);
    };

    boardView.addEventListener(EVENT_AUTOREFRESH, onEvent);

    return () => boardView.removeEventListener(EVENT_AUTOREFRESH, onEvent);
  }, [users, keywords, testMode, boardView, classes]);

  return null;
}
