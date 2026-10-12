import { useEffect, useLayoutEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import store from 'core/store';
import { useArcaSocket } from 'hooks/WebSocket';
import { useLoadChecker } from 'hooks/LoadChecker';

import Info from './FeatureInfo';

const styleEl = document.createElement('style');
document.body.append(styleEl);

function applyStyle(storage) {
  const {
    notifyPosition,
    navControlPosition,
    navControlItemDirection,
    searchBar,
    userName,
    recentVisit,
    sideMenu,
    sideContents,
    sideBests,
    fontSizeEnabled,
    fontSize,
  } = storage;

  const styles = [];

  // 알림 팝업 위치
  styles.push(`
    .body #toastbox {
      ${notifyPosition.includes('left') ? 'right: initial !important;' : ''} 
      ${notifyPosition.includes('top') ? 'height: calc(100% - 4rem - 52px);' : ''}
    }
  `);

  // 네비게이션 버튼
  styles.push(`
    .body .nav-control {
      ${navControlPosition.includes('left') ? 'right: initial !important;' : ''} 
      ${navControlPosition.includes('left') ? 'left: 0;' : ''} 
      ${navControlPosition.includes('top') ? 'top: 53px;' : ''} 
      ${navControlPosition.includes('top') ? 'bottom: initial !important;' : ''} 
      margin: 1rem !important;

      display: flex;
      flex-direction: ${navControlItemDirection};
      gap: 0.2rem;
    }
    
    .body .nav-control li { margin-right: 0 !important; }
  `);

  // 검색창 숨김 여부
  if (!searchBar) {
    styles.push(`
      li.nav-channel-search-wrapper { display: none !important; }
      li.nav-channel-mobile-search-wrapper { display: none !important; }
    `);
  }

  // 사용자 메뉴
  if (!userName) {
    styles.push(`
      .body span.username { display: none !important; }
    `);
  }

  // 최근 방문 채널
  switch (recentVisit) {
    case 'beforeAd':
      styles.push(`
        [class$="-article-list"] { display: flex; flex-direction: column; }
        [class$="-article-list"] .board-title { order: -99; }
        [class$="-article-list"] .board-title+.btns-board { order: -98; margin-bottom: 0.5rem; }
        [class$="-article-list"] .channel-visit-history { order: -50; margin-bottom: 0.5rem; }
      `);
      break;
    case 'none':
      styles.push(`
        [class$="-article-list"] .channel-visit-history { display: none; }
      `);
      break;
    default:
      // nothing
      break;
  }

  // 사이드 바 레이아웃 처리
  if (!sideMenu) {
    const widthStyles = [1100, 1200, 1300, 1500, 1600].map(
      (w) => `
        html.width-${w} .body .content-wrapper { grid-template-columns: auto 1fr !important; }

        @media screen and (max-width: ${w + 400}px) {
          html.width-${w} .body .content-wrapper { grid-template-columns: 1fr !important; }
        }
      `,
    );

    styles.push(`
      ${widthStyles.join('\n\n')}
      html:not([class*width]) .body .content-wrapper: { grid-template-columns: 1frm !important; }
      html .right-sidebar { display: none; }
      html .board-article { margin: 0; }
    `);
  }

  // 사이드 바 핫딜 (베스트 라이브는 없어진 듯)
  if (!sideContents) {
    styles.push(`
      .sidebar .sidebar-item:first-child { display: none; }
    `);
  }

  // 사이드 바 개념글
  if (!sideBests) {
    styles.push(`
      .sidebar .sidebar-item:nth-child(2) { display: none; }
    `);
  }

  // 폰트 사이즈
  if (fontSizeEnabled) {
    styles.push(`
      html { font-size: ${fontSize}px !important; }
    `);
  }

  styleEl.textContent = styles.join('\n\n');
}
applyStyle(store.getState()[Info.id].storage);

export default function SiteCustom() {
  const [subscribeWS, unsubscribeWS] = useArcaSocket();
  const faviconLoaded = useLoadChecker('#dynamic-favicon');

  const { spoofTitle, spoofFavicon, ...storage } = useSelector(
    (state) => state[Info.id].storage,
  );
  const titleRef = useRef(document.title);

  // 레이아웃 커스텀 반영
  useLayoutEffect(() => {
    applyStyle(storage);
  }, [storage]);

  // 사이트 표시 제목 변경
  useEffect(() => {
    document.title = spoofTitle || titleRef.current;
  }, [spoofTitle]);

  // 사이트 파비콘 변경
  useEffect(() => {
    if (!spoofFavicon) return undefined;
    if (!faviconLoaded) return undefined;

    const defaultUrl = document.querySelector('#dynamic-favicon').href;
    const changeFavicon = (url) => {
      const faviconEl = document.querySelector('#dynamic-favicon');
      faviconEl.href = url;
    };

    const observer = new MutationObserver(() => changeFavicon(spoofFavicon));

    changeFavicon(spoofFavicon);
    observer.observe(document.head, { childList: true });

    return () => {
      observer.disconnect();
      changeFavicon(defaultUrl);
    };
  }, [faviconLoaded, spoofFavicon, subscribeWS, unsubscribeWS]);

  return null;
}
