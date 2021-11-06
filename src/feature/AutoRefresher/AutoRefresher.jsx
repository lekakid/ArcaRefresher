import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  const sockCount = useRef(0);

  const classes = useStyles();

  const handleRefresh = useCallback(async () => {
    if (sockCount.current === 0) return;

    const newArticle = await getNewArticle();
    swapArticle(board, newArticle, classes.refreshed);
    dispatchAREvent(EVENT_AUTOREFRESH);
    sockCount.current = 0;
  }, [board, classes]);

  useEffect(() => {
    const search = queryString.parse(window.location.search, {
      parseNumbers: true,
    });
    if (boardLoaded && (!search.p || search.p === 1))
      setBoard(document.querySelector(BOARD_VIEW_WITHOUT_ARTICLE));
  }, [boardLoaded]);

  // 웹 소켓으로 새로고침 트래픽 감소
  useEffect(() => {
    if (!board) return;
    if (countdown === 0) return;

    const { protocol, host, pathname, search } = window.location;

    const connect = () => {
      const sock = new WebSocket(
        `ws${protocol === 'https:' ? 's' : ''}://${host}/arcalive`,
        'arcalive',
      );
      sock.onopen = () => {
        sock.send('hello');
        sock.send(`c|${pathname}${search}`);
      };
      sock.onmessage = (e) => {
        if (e.data === 'na') sockCount.current += 1;
      };
      sock.onclose = () => {
        setTimeout(connect, 1000);
      };
    };
    connect();
  }, [board, countdown]);

  useEffect(() => {
    if (!board) return undefined;
    if (countdown === 0) return undefined;

    const onManageArticle = ({ target }) => {
      if (target.tagName !== 'INPUT') return;

      if (target.classList.contains('batch-check-all')) {
        setPause(target.checked);
        return;
      }

      setPause(!!board.querySelector('.batch-check:checked'));
    };
    const onFocusOut = () => {
      if (document.hidden) {
        setPause(true);
      } else {
        setPause(false);
        handleRefresh();
      }
    };
    board.addEventListener('click', onManageArticle);
    document.addEventListener('visibilitychange', onFocusOut);

    return () => {
      board.removeEventListener('click', onManageArticle);
      document.removeEventListener('visibilitychange', onFocusOut);
    };
  }, [board, countdown, handleRefresh]);

  useEffect(() => {
    if (!board) return null;
    if (countdown === 0) return null;
    if (pause) return null;

    const timer = setInterval(handleRefresh, countdown * 1000);

    return () => clearInterval(timer);
  }, [board, countdown, pause, classes, handleRefresh]);

  if (!board) return null;
  return (
    <Fade in={countdown !== 0 && showProgress}>
      <div>
        <RefreshProgress count={countdown} animate={!pause} />
      </div>
    </Fade>
  );
}
