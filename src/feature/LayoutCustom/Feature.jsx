import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

import Info from './FeatureInfo';

const useStyles = makeStyles(
  (theme) => ({
    FontSize: ({ fontSize }) => ({
      fontSize,
    }),
    TopNews: {
      '& .topbar-area': {
        display: 'none !important',
      },
    },
    RecentVisit: {
      '& .channel-visit-history': {
        display: 'none',
      },
    },
    SideContents: {
      '& #recentHumor': {
        display: 'none !important',
      },
      '& #recentLive': {
        display: 'none !important',
      },
    },
    SideNews: {
      '& #newsRank': {
        display: 'none !important',
      },
    },
    SideMenu: {
      '&.width-1100': {
        '& .body .content-wrapper': {
          [theme.breakpoints.up(1500)]: {
            gridTemplateColumns: 'auto 1fr',
          },
          [theme.breakpoints.down(1500)]: {
            gridTemplateColumns: '1fr',
          },
        },
      },
      '&.width-1200': {
        '& .body .content-wrapper': {
          [theme.breakpoints.up(1600)]: {
            gridTemplateColumns: 'auto 1fr',
          },
          [theme.breakpoints.down(1600)]: {
            gridTemplateColumns: '1fr',
          },
        },
      },
      '&.width-1300': {
        '& .body .content-wrapper': {
          [theme.breakpoints.up(1700)]: {
            gridTemplateColumns: 'auto 1fr',
          },
          [theme.breakpoints.down(1700)]: {
            gridTemplateColumns: '1fr',
          },
        },
      },
      '&.width-1500': {
        '& .body .content-wrapper': {
          [theme.breakpoints.up(1900)]: {
            gridTemplateColumns: 'auto 1fr',
          },
          [theme.breakpoints.down(1900)]: {
            gridTemplateColumns: '1fr',
          },
        },
      },
      '&.width-1600': {
        '& .body .content-wrapper': {
          [theme.breakpoints.up(2000)]: {
            gridTemplateColumns: 'auto 1fr',
          },
          [theme.breakpoints.down(2000)]: {
            gridTemplateColumns: '1fr',
          },
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
  }),
  {
    name: Info.ID,
  },
);

export default function LayoutCustom() {
  const {
    storage: { enabled, ...storage },
  } = useSelector((state) => state[Info.ID]);
  const classes = useStyles(storage);

  useLayoutEffect(() => {
    if (!enabled) return undefined;

    const {
      recentVisit,
      topNews,
      sideContents,
      sideNews,
      sideMenu,
      avatar,
      hideUnvote,
      modifiedIndicator,
      hideVoiceComment,
      unfoldLongComment,
    } = storage;
    const styles = clsx(
      classes.FontSize,
      classes.UserinfoWidth,
      classes.ResizeImage,
      classes.ResizeVideo,
      classes.ResizeEmoticonPalette,
      {
        [classes.RecentVisit]: !recentVisit,
        [classes.TopNews]: !topNews,
        [classes.SideContents]: !sideContents,
        [classes.SideNews]: !sideNews,
        [classes.SideMenu]: !sideMenu,
        [classes.Avatar]: !avatar,
        [classes.Unvote]: hideUnvote,
        [classes.ModifiedIndicator]: !modifiedIndicator,
        [classes.HideVoiceComment]: hideVoiceComment,
        [classes.UnfoldLongComment]: unfoldLongComment,
      },
    ).split(' ');
    document.documentElement.classList.add(...styles);

    return () => document.documentElement.classList.remove(...styles);
  }, [classes, enabled, storage]);

  return null;
}
