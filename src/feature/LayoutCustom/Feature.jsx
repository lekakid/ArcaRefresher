import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

import Info from './FeatureInfo';

const useStyles = makeStyles(
  (theme) => {
    const widthEntries = [1100, 1200, 1300, 1500, 1600].map((w) => [
      `&.width-${w}`,
      {
        '& .body .content-wrapper': {
          [theme.breakpoints.up(w + 400)]: {
            gridTemplateColumns: 'auto 1fr',
          },
          [theme.breakpoints.down(w + 400)]: {
            gridTemplateColumns: '1fr',
          },
        },
      },
    ]);

    return {
      FontSize: ({ fontSize }) => ({
        fontSize,
      }),
      NotiPos: ({ notifyPosition }) => ({
        '& .body #toastbox': {
          right: notifyPosition.indexOf('left') > -1 ? 'initial' : 0,
          height:
            notifyPosition.indexOf('top') > -1
              ? 'calc(100% - 4rem - 52px)'
              : undefined,
        },
      }),
      TopNews: {
        '& .topbar-area': {
          display: 'none !important',
        },
      },
      RecentVisit: ({ recentVisit }) => {
        switch (recentVisit) {
          case 'beforeBtns':
            return {
              '& .board-article-list': {
                display: 'flex',
                flexDirection: 'column',
                '& .board-title': {
                  order: -99,
                },
                '& .channel-visit-history': {
                  order: -50,
                  marginBottom: '0.5rem',
                },
              },
            };
          case 'afterAd':
            return {
              '& .board-article-list': {
                display: 'inherit',
                '& .channel-visit-history': {
                  display: 'inherit',
                },
              },
            };
          case 'none':
            return {
              '& .board-article-list': {
                '& .channel-visit-history': {
                  display: 'none',
                },
              },
            };
          default:
            return {
              '& .board-article-list': {
                display: 'inherit',
                '& .channel-visit-history': {
                  display: 'inherit',
                },
              },
            };
        }
      },
      SideContents: {
        '& .sidebar .sidebar-item:first-child': {
          display: 'none !important',
        },
      },
      SideBests: {
        '& .sidebar .sidebar-item:nth-child(2)': {
          display: 'none !important',
        },
      },
      SideNews: {
        '& #newsRank': {
          display: 'none !important',
        },
      },
      SideMenu: {
        ...Object.fromEntries(widthEntries),
        '&:not([class*=width])': {
          '& .body .content-wrapper': {
            gridTemplateColumns: '1fr',
          },
        },
        '& .board-article': {
          margin: 0,
        },
        '& .right-sidebar': {
          display: 'none',
        },
      },
      Avatar: {
        '& .avatar': {
          display: 'none !important',
        },
        '& .input-wrapper > .input': {
          width: 'calc(100% - 5rem) !important',
        },
      },
      UserinfoWidth: ({ userinfoWidth }) => ({
        '& .vcol.col-author': {
          width: `calc(7rem * (1 + ${userinfoWidth * 0.01})) !important`,
        },
      }),
      ResizeImage: ({ resizeImage }) => ({
        '& .article-body': {
          '& img, & video:not([controls])': {
            '&:not([class$="emoticon"])': {
              maxWidth: `${resizeImage}% !important`,
            },
          },
        },
      }),
      ResizeVideo: ({ resizeVideo }) => ({
        '& .article-body video[controls]': {
          maxWidth: `${resizeVideo}% !important`,
        },
      }),
      ResizeEmoticonPalette: ({ resizeEmoticonPalette }) => ({
        '& .namlacon': {
          height: 'auto !important',
          '& .emoticons': {
            maxHeight: `${resizeEmoticonPalette * 100}px !important`,
          },
        },
      }),
      Unvote: {
        '& #rateDownForm': {
          display: 'none',
        },
      },
      ModifiedIndicator: {
        '& b.modified': {
          display: 'none',
        },
      },
      ReverseComment: {
        '& #comment': {
          display: 'grid',
          gridTemplateAreas: '"title"\n"form"\n"comments"',
        },
        '& #comment .title': {
          gridArea: 'title',
        },
        '& #comment #commentForm': {
          gridArea: 'form',
        },
        '& #comment .list-area': {
          gridArea: 'comments',
        },
      },
      HideVoiceComment: {
        '& #comment .btn-voicecmt': {
          display: 'none !important',
        },
      },
      UnfoldLongComment: {
        '& #comment .message': {
          maxHeight: 'none !important',
        },
        '& #comment .btn-more': {
          display: 'none !important',
        },
      },
      FixDarkModeWriteForm: {
        '& .dark-theme.fr-box.fr-basic .fr-wrapper': {
          border: '1px solid var(--color-bd-outer)',
          borderBottom: 'none',
          background: 'var(--color-bg-body)',
        },
        '& .dark-theme.fr-box.fr-basic .fr-element': {
          color: 'var(--color-text)',
        },
        '& .dark-theme .fr-second-toolbar': {
          background: '#353535',
          border: '1px solid var(--color-bd-outer)',
          color: 'var(--color-text)',
        },
      },
    };
  },
  {
    name: Info.ID,
  },
);

export default function LayoutCustom() {
  const { enabled, ...storage } = useSelector(
    (state) => state[Info.ID].storage,
  );
  const classes = useStyles(storage);

  useLayoutEffect(() => {
    if (!enabled) return undefined;

    const {
      topNews,
      sideContents,
      sideBests,
      sideNews,
      sideMenu,
      avatar,
      hideUnvote,
      modifiedIndicator,
      reverseComment,
      hideVoiceComment,
      unfoldLongComment,
      fixDarkModeWriteForm,
    } = storage;
    const styles = clsx(
      classes.FontSize,
      classes.RecentVisit,
      classes.NotiPos,
      classes.UserinfoWidth,
      classes.ResizeImage,
      classes.ResizeVideo,
      classes.ResizeEmoticonPalette,
      {
        [classes.TopNews]: !topNews,
        [classes.SideContents]: !sideContents,
        [classes.SideBests]: !sideBests,
        [classes.SideNews]: !sideNews,
        [classes.SideMenu]: !sideMenu,
        [classes.Avatar]: !avatar,
        [classes.Unvote]: hideUnvote,
        [classes.ModifiedIndicator]: !modifiedIndicator,
        [classes.ReverseComment]: reverseComment,
        [classes.HideVoiceComment]: hideVoiceComment,
        [classes.UnfoldLongComment]: unfoldLongComment,
        [classes.FixDarkModeWriteForm]: fixDarkModeWriteForm,
      },
    ).split(' ');
    document.documentElement.classList.add(...styles);

    return () => document.documentElement.classList.remove(...styles);
  }, [classes, enabled, storage]);

  return null;
}
