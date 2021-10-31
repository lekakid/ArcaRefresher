import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

import { MODULE_ID } from './ModuleInfo';

const useStyles = makeStyles(
  () => ({
    RecentVisit: {
      '& .visited-channel-wrap': {
        display: 'none',
      },
    },
    SideHumor: {
      '& #recentHumor': {
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
    NotifyColor: ({ notifyColor }) => ({
      '& .noti-menu-link span[style]': {
        color: `${notifyColor} !important`,
      },
    }),
    UserinfoWidth: ({ userinfoWidth }) => ({
      '& .vcol.col-author': {
        width: `calc(7rem * (1 + ${userinfoWidth * 0.01})) !important`,
      },
    }),
    ResizeImage: ({ resizeImage }) => ({
      '& .article-body img, & .article-body video:not([controls])': {
        maxWidth: `${resizeImage}% !important`,
      },
    }),
    ResizeVideo: ({ resizeVideo }) => ({
      '& .article-body video[controls]': {
        maxWidth: `${resizeVideo}% !important`,
      },
    }),
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
        display: 'none',
      },
    },
    HideHumorCheckbox: {
      '& .copyHumor': {
        display: 'none',
      },
    },
  }),
  {
    name: MODULE_ID,
  },
);

export default function LayoutCustom() {
  const config = useSelector((state) => state[MODULE_ID]);
  const classes = useStyles(config);

  useLayoutEffect(() => {
    const {
      recentVisit,
      sideHumor,
      sideNews,
      sideMenu,
      avatar,
      modifiedIndicator,
      unfoldLongComment,
      hideHumorCheckbox,
    } = config;
    const styles = clsx(
      classes.NotifyColor,
      classes.UserinfoWidth,
      classes.ResizeImage,
      classes.ResizeVideo,
      {
        [classes.RecentVisit]: !recentVisit,
        [classes.SideHumor]: !sideHumor,
        [classes.SideNews]: !sideNews,
        [classes.SideMenu]: !sideMenu,
        [classes.Avatar]: !avatar,
        [classes.ModifiedIndicator]: !modifiedIndicator,
        [classes.UnfoldLongComment]: unfoldLongComment,
        [classes.HideHumorCheckbox]: hideHumorCheckbox,
      },
    ).split(' ');
    document.documentElement.classList.add(...styles);

    return () => document.documentElement.classList.remove(...styles);
  }, [classes, config]);

  return null;
}
