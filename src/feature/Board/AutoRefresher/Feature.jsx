import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useSelector } from 'react-redux';
import { Fade } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import { BOARD_LOADED, BOARD } from 'core/selector';
import { EVENT_BOARD_REFRESH, useDispatchEvent } from 'hooks/Event';
import { useLoadChecker } from 'hooks/LoadChecker';

import Info from './FeatureInfo';
import RefreshProgress from './RefreshProgress';
import { getNewArticle, updateBoard } from './article';

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

/**
 * 주소 끝 search string을 Object로 반환
 * @example 'arca.live/b/breaking?p=2&type=best' => { p: '2', type: 'best' }
 */
function parseSearch(searchString) {
  const entries = searchString
    .substring(1)
    .split('&')
    .filter((t) => t)
    .map((t) => t.split('='));
  return Object.fromEntries(entries);
}

function AutoRefresher({ classes }) {
  const dispatchEvent = useDispatchEvent();
  const boardLoaded = useLoadChecker(BOARD_LOADED);

  const { countdown, maxTime, refreshOnArticle, showProgress } = useSelector(
    (state) => state[Info.ID].storage,
  );
  const [board, setBoard] = useState(null);
  const [pause, setPause] = useState({
    management: false,
    unfocus: false,
  });
  const refreshData = useRef({
    newArticle: 0, // 반영 안 된 새 게시물 수
    accTime: 0, // 새 게시물이 없는채로 누적된 시간
    mouseTimer: undefined, // 마우스 이동 시 동작하는 타이머
  });

  const enabled = useMemo(() => {
    if (countdown === 0) return false;
    // 아카라이브 검색 기능이 꽤 많은 리소스를 쓰는걸로 보임
    // 서버를 위해서라도 다음에 해당하면 새로고침이 동작하지 않음
    // 1. 주소 기준으로 지금 보고 있는 게시물이 어느 페이지인지 알 수 없음
    // 2. 게시물 조회 페이지가 1페이지가 아님
    // 3. 날짜 혹은 키워드 검색을 사용 중임
    const search = parseSearch(window.location.search);
    const searchKeys = Object.keys(search);
    const targetKeys = ['after', 'before', 'near'];
    const page = parseInt(search.p, 10);
    const isKeywordSearch = searchKeys.some((key) => targetKeys.includes(key));
    if (page > 1) return false;
    if (isKeywordSearch) return false;

    // 게시판이 존재하는지 로드 체크를 전체글 버튼이 있는 엘리먼트를 사용함
    // 파이어폭스 같은 코드 실행이 빠른 브라우저에서는 이 코드가 실행될 쯤엔
    // pagination 엘리먼트가 생기기 전일 수도 있어서 사용할 수 없음
    // 로드 체크 설렉터(boardLoaded)를 pagination으로 변경하는 것은 자식 요소들이 다 있는지 체크 못해서 안됨
    // 게시물 조회 중일 때 페이지를 알 수 있는지 검사하는 것으로 대체함
    const articleId = window.location.pathname.split('/')[3];
    if (articleId && !(refreshOnArticle && search.p)) return false;

    return true;
  }, [countdown, refreshOnArticle]);

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
    updateBoard(board, newArticles, classes.refreshed);
    dispatchEvent(EVENT_BOARD_REFRESH);

    // 리셋
    refreshData.current.newArticle = 0;
    refreshData.current.accTime = 0;
  }, [board, classes, countdown, maxTime, dispatchEvent]);

  useEffect(() => {
    if (!enabled) return undefined;
    if (!boardLoaded) return undefined;

    const boardElement = document.querySelector(BOARD);
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
    if (!boardLoaded) return;

    const { host, pathname, search } = window.location;

    const connect = () => {
      // 아카라이브 WebSocket 연결
      const sock = new WebSocket(`wss://${host}/arcalive`, 'arcalive');
      const path = pathname.split('/').slice(0, 3).join('/');

      sock.onopen = () => {
        sock.send('hello');
        // 최신 게시물 페이지 일정 범위 이내라면 검색 조건에 관계 없이 항상 새글 알림이 옴
        sock.send(`c|${path}${search}`);
      };
      sock.onmessage = (e) => {
        // 새 게시물이 있음
        if (e.data === 'na') refreshData.current.newArticle += 1;
      };
      // 연결을 닫은 경우 1초 대기 후 재연결
      sock.onclose = () => {
        setTimeout(connect, 1000);
      };
      // 오류로 끊긴 경우 1초 대기 후 재연결
      sock.onerror = () => {
        setTimeout(connect, 1000);
      };
    };
    connect();
  }, [boardLoaded]);

  useEffect(() => {
    if (!enabled) return undefined;
    if (!board) return undefined;

    // 게시물 관리를 위해 1개 이상 체크한 경우
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

    // 브라우저 탭이 최소화되는 경우
    const onFocusOut = () => {
      setPause((prev) => ({
        ...prev,
        unfocus: document.hidden,
      }));
      if (!document.hidden) tryRefresh();
    };

    board.addEventListener('click', onManageArticle);
    document.addEventListener('visibilitychange', onFocusOut);

    return () => {
      board.removeEventListener('click', onManageArticle);
      document.removeEventListener('visibilitychange', onFocusOut);
    };
  }, [board, enabled, tryRefresh]);

  useEffect(() => {
    if (!enabled) return undefined;
    if (pause.management || pause.unfocus) return undefined;

    const timer = setInterval(tryRefresh, countdown * 1000);

    return () => clearInterval(timer);
  }, [countdown, enabled, pause, tryRefresh]);

  return (
    <Fade in={enabled && showProgress}>
      <div>
        <RefreshProgress
          count={enabled ? countdown : 0}
          animate={!(pause.management || pause.unfocus)}
        />
      </div>
    </Fade>
  );
}

export default withStyles(styles)(AutoRefresher);
