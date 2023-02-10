import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Fade } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import queryString from 'query-string';

import { BOARD_LOADED, BOARD } from 'core/selector';
import { dispatchAREvent, EVENT_AUTOREFRESH } from 'core/event';
import { useLoadChecker } from 'util/LoadChecker';

import Info from './FeatureInfo';
import RefreshProgress from './RefreshProgress';
import { getNewArticle, swapArticle } from './article';

const styles = {
  refreshed: {
    animationName: '$light',
    animationDuration: 500,
  },
  '@keyframes light': {
    '0%': {
      backgroundColor: 'var(--color-bg-focus)',
    },
    '100%': {
      backgroundColor: 'transparent',
    },
  },
};

function AutoRefresher({ classes }) {
  const boardLoaded = useLoadChecker(BOARD_LOADED);
  const {
    storage: { countdown, maxTime, showProgress },
  } = useSelector((state) => state[Info.ID]);
  const [board, setBoard] = useState(null);
  const [pause, setPause] = useState({
    management: false,
    unfocus: false,
  });
  const sockCount = useRef({ newArticle: 0, accTime: 0 });
  const mouseMoveTimer = useRef(null);

  const handleRefresh = useCallback(async () => {
    if (sockCount.current.newArticle === 0) {
      if (maxTime === -1) return;

      if (sockCount.current.accTime < maxTime) {
        sockCount.current.accTime += countdown;
        return;
      }
    }

    if (mouseMoveTimer.current) return;

    const newArticle = await getNewArticle();
    if (newArticle.length === 0) return;

    swapArticle(board, newArticle, classes.refreshed);
    dispatchAREvent(EVENT_AUTOREFRESH);
    sockCount.current.newArticle = 0;
    sockCount.current.accTime = 0;
  }, [board, classes, countdown, maxTime]);

  useEffect(() => {
    if (!boardLoaded) return;

    const search = queryString.parse(window.location.search, {
      parseNumbers: true,
    });
    const searchKeys = Object.keys(search);
    const targetKeys = ['after', 'before', 'near'];
    if (search.p > 1 || searchKeys.some((key) => targetKeys.includes(key)))
      return;

    const boardElement = document.querySelector(BOARD);
    if (!boardElement) return;
    setBoard(boardElement);

    boardElement.addEventListener('mousemove', () => {
      if (mouseMoveTimer.current) {
        clearTimeout(mouseMoveTimer.current);
      }

      mouseMoveTimer.current = setTimeout(() => {
        mouseMoveTimer.current = null;
      }, 1000);
    });
  }, [boardLoaded]);

  // 웹 소켓으로 새로고침 트래픽 감소
  useEffect(() => {
    if (!board) return;
    if (countdown === 0) return;

    const { host, pathname, search } = window.location;

    const connect = () => {
      const sock = new WebSocket(`wss://${host}/arcalive`, 'arcalive');
      sock.onopen = () => {
        sock.send('hello');
        sock.send(`c|${pathname}${search}`);
      };
      sock.onmessage = (e) => {
        if (e.data === 'na') sockCount.current.newArticle += 1;
      };
      sock.onclose = () => {
        setTimeout(connect, 1000);
      };
      sock.onerror = () => {
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
        setPause((prev) => ({
          ...prev,
          management: target.checked,
        }));
        return;
      }

      setPause((prev) => ({
        ...prev,
        management: !!board.querySelector('.batch-check:checked'),
      }));
    };
    const onFocusOut = () => {
      setPause((prev) => ({
        ...prev,
        unfocus: document.hidden,
      }));
      if (!document.hidden) handleRefresh();
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
    if (pause.management || pause.unfocus) return null;

    const timer = setInterval(handleRefresh, countdown * 1000);

    return () => clearInterval(timer);
  }, [board, countdown, pause, classes, handleRefresh]);

  if (!board) return null;
  return (
    <Fade in={countdown !== 0 && showProgress}>
      <div>
        <RefreshProgress
          count={countdown}
          animate={!(pause.management || pause.unfocus)}
        />
      </div>
    </Fade>
  );
}

export default withStyles(styles)(AutoRefresher);
