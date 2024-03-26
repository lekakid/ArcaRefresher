import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { GlobalStyles } from '@mui/material';

import { useArcaSocket } from 'hooks/WebSocket';

import Info from './FeatureInfo';

/* eslint-disable react/prop-types */

function NotifyPositionStyles({ value }) {
  return (
    <GlobalStyles
      styles={{
        '.body #toastbox': {
          right: value.indexOf('left') > -1 ? 'initial !important' : undefined,
          height:
            value.indexOf('top') > -1 ? 'calc(100% - 4rem - 52px)' : undefined,
        },
      }}
    />
  );
}

function TopNewsStyles({ value }) {
  if (value) return null;

  return (
    <GlobalStyles
      styles={{
        'li.topbar-area': {
          display: 'none !important',
        },
      }}
    />
  );
}

function SearchBarStyles({ value }) {
  if (value) return null;

  return (
    <GlobalStyles
      styles={{
        'html li.nav-channel-search-wrapper': {
          display: 'none !important',
        },
      }}
    />
  );
}

function RecentVisitStyles({ value }) {
  let styles;
  switch (value) {
    case 'beforeAd':
      styles = {
        '.board-article-list, .included-article-list': {
          display: 'flex',
          flexDirection: 'column',
          '& .board-title': {
            order: -99,
          },
          '& .board-title+.btns-board': {
            order: -98,
            marginBottom: '0.5rem',
          },
          '& .channel-visit-history': {
            order: -50,
            marginBottom: '0.5rem',
          },
        },
      };
      break;
    case 'afterAd':
      styles = {
        '.board-article-list, .included-article-list': {
          display: 'inherit',
          '& .channel-visit-history': {
            display: 'inherit',
          },
        },
      };
      break;
    case 'none':
      styles = {
        '.board-article-list, .included-article-list': {
          '& .channel-visit-history': {
            display: 'none',
          },
        },
      };
      break;
    default:
      styles = {
        '.board-article-list': {
          display: 'inherit',
          '& .channel-visit-history': {
            display: 'inherit',
          },
        },
      };
      break;
  }
  return <GlobalStyles styles={styles} />;
}

function SideMenuStyles({ value }) {
  if (value) return null;

  return (
    <GlobalStyles
      styles={(theme) => {
        const widthEntries = [1100, 1200, 1300, 1500, 1600].map((w) => [
          `html.width-${w}`,
          {
            '& .body .content-wrapper:not(.no-sidebar)': {
              [theme.breakpoints.up(w + 400)]: {
                gridTemplateColumns: 'auto 1fr !important',
              },
              [theme.breakpoints.down(w + 400)]: {
                gridTemplateColumns: '1fr !important',
              },
            },
          },
        ]);

        return {
          ...Object.fromEntries(widthEntries),
          'html:not([class*=width])': {
            '& .body .content-wrapper': {
              gridTemplateColumns: '1fr !important',
            },
          },
          'html .board-article': {
            margin: 0,
          },
          'html .right-sidebar': {
            display: 'none',
          },
        };
      }}
    />
  );
}

function SideContentsStyles({ value }) {
  if (value) return null;

  return (
    <GlobalStyles
      styles={{
        '.sidebar .sidebar-item:first-child': {
          display: 'none !important',
        },
      }}
    />
  );
}

function SideBestsStyles({ value }) {
  if (value) return null;

  return (
    <GlobalStyles
      styles={{
        '.sidebar .sidebar-item:nth-child(2)': {
          display: 'none !important',
        },
      }}
    />
  );
}

function SideNewsStyles({ value }) {
  if (value) return null;

  return (
    <GlobalStyles
      styles={{
        '#newsRank': {
          display: 'none !important',
        },
      }}
    />
  );
}

function FontSizeStyles({ value }) {
  return (
    <GlobalStyles
      styles={{
        fontSize: value,
      }}
    />
  );
}

function FixDarkModeWriteFormStyles({ value }) {
  if (!value) return null;

  return (
    <GlobalStyles
      styles={{
        '.write-body .dark-theme': {
          '&.fr-box.fr-basic .fr-wrapper': {
            border: '1px solid var(--color-bd-outer)',
            borderBottom: 'none',
            background: 'var(--color-bg-body)',
          },
          '&.fr-box.fr-basic .fr-element': {
            color: 'var(--color-text)',
          },
          '& .fr-second-toolbar': {
            background: '#353535',
            border: '1px solid var(--color-bd-outer)',
            color: 'var(--color-text)',
          },
        },
      }}
    />
  );
}

/* eslint-enable react/prop-types */

export default function SiteCustom() {
  const [subscribeWS, unsubscribeWS] = useArcaSocket();

  const {
    // 모양
    notifyPosition,
    topNews,
    searchBar,
    recentVisit,
    sideContents,
    sideBests,
    sideNews,
    sideMenu,
    fontSize,
    fixDarkModeWriteForm,
    // 동작
    spoofTitle,
    spoofFavicon,
  } = useSelector((state) => state[Info.id].storage);
  const titleRef = useRef(document.title);

  // 사이트 표시 제목 변경
  useEffect(() => {
    document.title = spoofTitle || titleRef.current;
  }, [spoofTitle]);

  // 사이트 파비콘 변경
  useEffect(() => {
    if (!spoofFavicon) return undefined;

    const defaultUrl = document.querySelector('#dynamic-favicon').href;
    const changeFavicon = (url) => {
      const faviconEl = document.querySelector('#dynamic-favicon');
      faviconEl.href = url;
    };

    // 글 알림 비활성화
    Object.defineProperty(unsafeWindow, 'notificationBadge', {
      get() {
        return 'default';
      },
      set() {},
    });
    changeFavicon(spoofFavicon);
    window.addEventListener('load', () => {
      changeFavicon(spoofFavicon);
    });

    const subscriber = {
      type: 'before',
      callback(e) {
        if (e.data.split('|').shift() === 'na') {
          Object.defineProperty(e, 'ignore', { value: true });
        }
      },
    };
    subscribeWS(subscriber);
    return () => {
      changeFavicon(defaultUrl);
      unsubscribeWS(subscriber);
      window.removeEventListener('load', changeFavicon);
    };
  }, [spoofFavicon, subscribeWS, unsubscribeWS]);

  return (
    <>
      <NotifyPositionStyles value={notifyPosition} />
      <TopNewsStyles value={topNews} />
      <SearchBarStyles value={searchBar} />
      <RecentVisitStyles value={recentVisit} />
      <SideMenuStyles value={sideMenu} />
      <SideContentsStyles value={sideContents} />
      <SideBestsStyles value={sideBests} />
      <SideNewsStyles value={sideNews} />
      <FontSizeStyles value={fontSize} />
      <FixDarkModeWriteFormStyles value={fixDarkModeWriteForm} />
    </>
  );
}
