import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Fade } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

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

export default function Refresher() {
  const { timeLimit, showProgress } = useSelector((state) => state[MODULE_ID]);
  const [board, setBoard] = useState(null);
  const [animate, setAnimation] = useState(true);
  const boardLoaded = useElementQuery(BOARD_LOADED);

  const classes = useStyles();

  useEffect(() => {
    if (boardLoaded)
      setBoard(document.querySelector(BOARD_VIEW_WITHOUT_ARTICLE));
  }, [boardLoaded]);

  useEffect(() => {
    if (!board) return null;

    const handlePause = (event) => {
      if (event.target.tagName !== 'INPUT') return;

      if (event.target.classList.contains('batch-check-all')) {
        if (event.target.checked) setAnimation(false);
        else setAnimation(true);
      } else {
        const btns = [...board.querySelectorAll('.batch-check')];
        if (btns.some((btn) => btn.checked)) {
          setAnimation(false);
          return;
        }

        setAnimation(true);
      }
    };
    board.addEventListener('click', handlePause);

    return () => board.removeEventListener('click', handlePause);
  }, [board]);

  useEffect(() => {
    if (!board) return null;
    if (timeLimit === 0) return null;

    const timer = setInterval(async () => {
      if (!animate) return;

      const newArticle = await getNewArticle();
      swapArticle(board, newArticle, classes.refreshed);
      dispatchAREvent(EVENT_AUTOREFRESH);
    }, timeLimit * 1000);

    return () => clearInterval(timer);
  }, [animate, board, classes.refreshed, timeLimit]);

  return (
    <Fade in={board && timeLimit !== 0 && showProgress}>
      <div>
        <RefreshProgress time={timeLimit} animate={animate} />
      </div>
    </Fade>
  );
}
