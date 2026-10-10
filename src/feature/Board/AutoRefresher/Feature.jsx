import { unsafeWindow } from '$';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Fade, GlobalStyles } from '@mui/material';

import { BOARD_LOADED, BOARD } from 'core/selector';
import { EVENT_BOARD_REFRESH } from 'core/event';
import { useLoadChecker } from 'hooks/LoadChecker';
import { useArcaSocket } from 'hooks/WebSocket';

import Info from './FeatureInfo';
import RefreshIndicator from './RefreshProgress';
import { getNewArticle, updateBoard } from './article';

const refreshStyles = (
  <GlobalStyles
    styles={{
      '.refreshed': {
        animationName: 'refreshed-animate',
        animationDuration: '0.5s',
      },
      '@keyframes refreshed-animate': {
        '0%': {
          backgroundColor: 'var(--color-bg-focus)',
        },
        '100%': {
          backgroundColor: 'transparent',
        },
      },
    }}
  />
);

const PAUSE_MANAGEMENT = 'management';
const PAUSE_UNFOCUS = 'unfocus';
const PAUSE_API = 'api';

function AutoRefresher() {
  const [subscribe, unsubscribe] = useArcaSocket();
  const boardLoaded = useLoadChecker(BOARD_LOADED);

  const { countdown, maxTime, refreshOnArticle, progressPos } = useSelector(
    (state) => state[Info.id].storage,
  );
  const { navControlPosition, navControlItemDirection } = useSelector(
    (state) => state.SiteCustom.storage,
  );
  const [board, setBoard] = useState();
  const [pause, setPause] = useState([]);
  const refreshData = useRef({
    newArticle: 0, // 반영 안 된 새 게시물 수
    accTime: 0, // 새 게시물이 없는채로 누적된 시간
    mouseTimer: undefined, // 마우스 이동 시 동작하는 타이머
  });

  const enabled = useMemo(() => {
    // 기능 사용 안함
    if (countdown === 0) return false;

    // 게시판이 로드되지 않음
    if (!boardLoaded) return false;

    // 검색 중에는 새로고침 기능 중단 (서버 부담 방지)
    const search = new URLSearchParams(window.location.search);

    // 2 페이지 이상 탐색 중인 경우 (중단)
    const page = parseInt(search.get('p'), 10);
    if (page > 1) return false;

    // 기간 검색 혹은 키워드 검색 중인 경우 (중단)
    const targetKeys = ['after', 'before', 'near', 'keyword'];
    const isKeywordSearch = targetKeys.some((key) => search.has(key));
    if (isKeywordSearch) return false;

    // 게시물 조회 중에도 새로고침을 사용한다면 허용
    if (refreshOnArticle && page === 1) return true;

    // 게시물 조회 중인 경우 (중단)
    const articleId = window.location.pathname.split('/')[3];
    if (articleId) return false;

    // 그 외
    return true;
  }, [boardLoaded, countdown, refreshOnArticle]);

  const tryRefresh = useCallback(async () => {
    if (refreshData.current.newArticle < 1) {
      // 설정 안함
      if (maxTime === -1) return;

      // 시간 누적
      if (refreshData.current.accTime < maxTime) {
        refreshData.current.accTime += countdown;
        return;
      }
    }

    // 마우스가 움직였음
    if (refreshData.current.mouseTimer) return;

    // 게시물 갱신
    const newArticles = await getNewArticle();
    if (!newArticles) return;
    updateBoard(board, newArticles, 'refreshed');
    window.dispatchEvent(new Event(EVENT_BOARD_REFRESH));

    // 리셋
    refreshData.current.newArticle = 0;
    refreshData.current.accTime = 0;
  }, [board, countdown, maxTime]);

  useEffect(() => {
    if (!enabled) return undefined;
    if (!boardLoaded) return undefined;

    const boardElement = document.querySelector(BOARD);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBoard(boardElement);

    // 마우스 이동 이벤트 등록
    const handleMouse = () => {
      if (refreshData.current.mouseTimer) {
        clearTimeout(refreshData.current.mouseTimer);
      }

      refreshData.current.mouseTimer = setTimeout(() => {
        refreshData.current.mouseTimer = null;
      }, 1000);
    };
    boardElement.addEventListener('mousemove', handleMouse);

    return () => boardElement.removeEventListener('mousemove', handleMouse);
  }, [boardLoaded, enabled]);

  // 웹 소켓 셋업
  useEffect(() => {
    if (!boardLoaded) return undefined;

    const onmessage = (e) => {
      if (e.data === 'na') refreshData.current.newArticle += 1;
    };

    const subscriber = { callback: onmessage, type: 'after' };
    subscribe(subscriber);

    return () => unsubscribe(subscriber);
  }, [boardLoaded, subscribe, unsubscribe]);

  useEffect(() => {
    if (!enabled) return undefined;
    if (!board) return undefined;

    // 게시물 관리를 위해 1개 이상 체크한 경우
    const onManageArticle = ({ target }) => {
      if (target.tagName !== 'INPUT') return;

      if (target.classList.contains('batch-check-all')) {
        setPause((prev) =>
          target.checked
            ? [...prev, PAUSE_MANAGEMENT]
            : prev.filter((p) => p !== PAUSE_MANAGEMENT),
        );
        return;
      }

      setPause((prev) =>
        !board.querySelector('.batch-check:checked')
          ? prev.filter((p) => p !== PAUSE_MANAGEMENT)
          : [...prev, PAUSE_MANAGEMENT],
      );
    };

    // 브라우저 탭이 최소화되는 경우
    const onFocusOut = () => {
      setPause((prev) =>
        document.hidden
          ? [...prev, PAUSE_UNFOCUS]
          : prev.filter((p) => p !== PAUSE_UNFOCUS),
      );
      if (!document.hidden) tryRefresh();
    };

    const apiPause = () => {
      setPause((prev) =>
        prev.includes(PAUSE_API)
          ? [...prev, PAUSE_API]
          : prev.filter((p) => p !== PAUSE_API),
      );
    };

    board.addEventListener('click', onManageArticle);
    document.addEventListener('visibilitychange', onFocusOut);
    unsafeWindow.ArcaRefresher ??= {};
    unsafeWindow.ArcaRefresher.toggleRefresh = apiPause;

    return () => {
      board.removeEventListener('click', onManageArticle);
      document.removeEventListener('visibilitychange', onFocusOut);
    };
  }, [board, enabled, tryRefresh]);

  useEffect(() => {
    if (!enabled) return undefined;
    if (pause.length > 0) return undefined;

    const timer = setInterval(tryRefresh, countdown * 1000);

    return () => clearInterval(timer);
  }, [countdown, enabled, pause, tryRefresh]);

  const samePosition = progressPos === navControlPosition;
  const pos = {
    top: progressPos.includes('top') ? '53px' : 'unset',
    bottom: progressPos.includes('bottom') ? 0 : 'unset',
    left: progressPos.includes('left') ? 0 : 'unset',
    right: progressPos.includes('right') ? 0 : 'unset',
    marginTop: `calc(1rem ${
      samePosition && navControlItemDirection.includes('row') ? '+ 50px' : ''
    })`,
    marginBottom: `calc(1rem ${
      samePosition && navControlItemDirection.includes('row') ? '+ 50px' : ''
    })`,
    marginLeft: `calc(1rem ${
      samePosition && navControlItemDirection.includes('column') ? '+ 50px' : ''
    })`,
    marginRight: `calc(1rem ${
      samePosition && navControlItemDirection.includes('column') ? '+ 50px' : ''
    })`,
  };

  return (
    <>
      {refreshStyles}
      <Fade in={enabled && progressPos !== 'hidden'}>
        <Box>
          <RefreshIndicator
            pos={pos}
            count={enabled ? countdown : 0}
            animate={pause.length === 0}
          />
        </Box>
      </Fade>
    </>
  );
}

export default AutoRefresher;
