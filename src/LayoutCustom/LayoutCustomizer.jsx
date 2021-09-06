import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import { MODULE_ID } from './ModuleInfo';

const useStyles = makeStyles(() => ({
  RecentVisit: {
    '& .visited-channel-wrap': {
      display: 'none',
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
    '& .write-body + div': {
      display: 'none',
    },
  },
}));

export default function LayoutCustomizer() {
  const config = useSelector((state) => state[MODULE_ID]);
  const classes = useStyles(config);

  useEffect(() => {
    const {
      recentVisit,
      sideMenu,
      avatar,
      modifiedIndicator,
      unfoldLongComment,
      hideHumorCheckbox,
    } = config;
    const classList = [
      ...(recentVisit ? [] : classes.RecentVisit.split(' ')),
      ...(sideMenu ? [] : classes.SideMenu.split(' ')),
      ...(avatar ? [] : classes.Avatar.split(' ')),
      ...classes.NotifyColor.split(' '),
      ...classes.UserinfoWidth.split(' '),
      ...classes.ResizeImage.split(' '),
      ...classes.ResizeVideo.split(' '),
      ...(modifiedIndicator ? [] : classes.ModifiedIndicator.split(' ')),
      ...(unfoldLongComment ? [] : classes.UnfoldLongComment.split(' ')),
      ...(!hideHumorCheckbox ? [] : classes.HideHumorCheckbox.split(' ')),
    ];
    document.documentElement.classList.add(...classList);

    return () => document.documentElement.classList.remove(...classList);
  }, [classes, config]);

  return null;
}
