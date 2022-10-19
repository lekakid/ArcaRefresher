import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

import Info from './FeatureInfo';

const useStyles = makeStyles(
  {
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
      '& .right-sidebar': {
        display: 'none',
      },
      '& .board-article': {
        margin: 0,
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
    UnfoldLongComment: {
      '& #comment .message': {
        maxHeight: 'none !important',
      },
      '& #comment .btn-more': {
        display: 'none !important',
      },
    },
  },
  {
    name: Info.ID,
  },
);

export default function LayoutCustom() {
  const { storage } = useSelector((state) => state[Info.ID]);
  const classes = useStyles(storage);

  useLayoutEffect(() => {
    if (!storage.enabled) return undefined;

    const {
      recentVisit,
      topNews,
      sideContents,
      sideNews,
      sideMenu,
      avatar,
      hideUnvote,
      modifiedIndicator,
      unfoldLongComment,
    } = storage;
    const styles = clsx(
      classes.FontSize,
      classes.UserinfoWidth,
      classes.ResizeImage,
      classes.ResizeVideo,
      {
        [classes.RecentVisit]: !recentVisit,
        [classes.TopNews]: !topNews,
        [classes.SideContents]: !sideContents,
        [classes.SideNews]: !sideNews,
        [classes.SideMenu]: !sideMenu,
        [classes.Avatar]: !avatar,
        [classes.Unvote]: hideUnvote,
        [classes.ModifiedIndicator]: !modifiedIndicator,
        [classes.UnfoldLongComment]: unfoldLongComment,
      },
    ).split(' ');
    document.documentElement.classList.add(...styles);

    return () => document.documentElement.classList.remove(...styles);
  }, [classes, storage]);

  return null;
}
