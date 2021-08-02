import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import {
  ARTICLE_DELETE_FORM,
  BOARD_LOADED,
  BOARD_VIEW_WITHOUT_ARTICLE,
} from '../$Common/Selector';
import useAwaitElement from '../$Common/AwaitElement';
import { EVENT_AUTOREFRESH } from '../$Common/Event';
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
  const [enabled, setEnable] = useState(false);

  const classes = useStyles();

  useAwaitElement(BOARD_LOADED, () => {
    setBoardView(document.querySelector(BOARD_VIEW_WITHOUT_ARTICLE));
  });

  useEffect(() => {
    if (!boardView) return;

    if (document.querySelector(ARTICLE_DELETE_FORM)) {
      setEnable(true);
    }
  }, [boardView]);

  useEffect(() => {
    if (!boardView) return null;
    if (!enabled) return null;

    const onEvent = () => {
      if (testMode) test(boardView, users, keywords, classes);
      else remove(boardView, users, keywords);
    };

    boardView.addEventListener(EVENT_AUTOREFRESH, onEvent);

    return () => boardView.removeEventListener(EVENT_AUTOREFRESH, onEvent);
  }, [users, keywords, testMode, boardView, enabled, classes]);

  return null;
}
