import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Fade } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import queryString from 'query-string';

import { BOARD_LOADED, BOARD_VIEW_WITHOUT_ARTICLE } from 'core/selector';
import { dispatchAREvent, EVENT_AUTOREFRESH } from 'core/event';
import { useElementQuery } from 'core/hooks';

import { MODULE_ID } from './ModuleInfo';
import RefreshProgress from './RefreshProgress';
import { getNewArticle, swapArticle } from './article';

const useStyles = makeStyles(() => ({
  refreshed: {
    animationName: '$light',
    animationDuration: 500,
  },
  '@keyframes light': {
    '0%': {
      backgroundColor: 'rgba(246, 247, 239, 1)',
    },
    '100%': {
      backgroundColor: 'rgba(246, 247, 239, 0)',
    },
  },
}));

export default function AutoRefresher() {
  const boardLoaded = useElementQuery(BOARD_LOADED);
  const { countdown, showProgress } = useSelector((state) => state[MODULE_ID]);
  const [board, setBoard] = useState(null);
  const [pause, setPause] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    const search = queryString.parse(window.location.search, {
      parseNumbers: true,
    });
    if (boardLoaded && (!search.p || search.p === 1))
      setBoard(document.querySelector(BOARD_VIEW_WITHOUT_ARTICLE));
  }, [boardLoaded]);

  useEffect(() => {
    if (!board) return null;

    const onManageArticle = ({ target }) => {
      if (target.tagName !== 'INPUT') return;

      if (target.classList.contains('batch-check-all')) {
        setPause(target.checked);
        return;
      }

      setPause(!!board.querySelector('.batch-check:checked'));
    };
    const onFocusOut = () => {
      setPause(document.hidden);
    };
    board.addEventListener('click', onManageArticle);
    document.addEventListener('visibilitychange', onFocusOut);

    return () => {
      board.removeEventListener('click', onManageArticle);
      document.removeEventListener('visibilitychange', onFocusOut);
    };
  }, [board]);

  useEffect(() => {
    if (!board) return null;
    if (countdown === 0) return null;
    if (pause) return null;

    const timer = setInterval(async () => {
      const newArticle = await getNewArticle();
      swapArticle(board, newArticle, classes.refreshed);
      dispatchAREvent(EVENT_AUTOREFRESH);
    }, countdown * 1000);

    return () => clearInterval(timer);
  }, [board, countdown, pause, classes]);

  if (!board) return null;
  return (
    <Fade in={countdown !== 0 && showProgress}>
      <div>
        <RefreshProgress count={countdown} animate={!pause} />
      </div>
    </Fade>
  );
}
