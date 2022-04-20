import React, { useCallback, useEffect, useState } from 'react';
import { IconButton, Portal } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Refresh } from '@material-ui/icons';

import {
  COMMENT_VIEW,
  COMMENT_LOADED,
  COMMENT_TITLE,
  COMMENT_SUBTITLE,
} from 'core/selector';
import { useElementQuery } from 'core/hooks';
import { dispatchAREvent, EVENT_COMMENT_REFRESH } from 'core/event';
import { getDateStr } from 'util/time';

import getNewComment from './getNewComment';

const style = {
  '@global': {
    '#comment .list-area:empty': {
      display: 'none',
    },
    '#comment .list-area:empty + .write-area': {
      borderTop: 'inherit',
    },
    '.refresh-container': {
      display: 'relative',
    },
  },
  root: {
    color: 'var(--color-text-muted)',
  },
};

function CommentRefresh({ classes }) {
  const [title, setTitle] = useState({
    top: undefined,
    bottom: undefined,
  });
  const [comment, setComment] = useState(undefined);
  const commentLoaded = useElementQuery(COMMENT_LOADED);

  // 초기화
  useEffect(() => {
    if (commentLoaded) {
      const commentView = document.querySelector(COMMENT_VIEW);
      setComment(commentView);
      const top = document.createElement('span');
      const bottom = document.createElement('span');
      document.querySelector(COMMENT_TITLE)?.append(top);
      document.querySelector(COMMENT_SUBTITLE)?.prepend(bottom);

      setTitle({ top, bottom });
    }
  }, [commentLoaded]);

  useEffect(() => {
    if (!comment) return undefined;

    const observer = new MutationObserver(() => {
      if (!comment.parentNode) {
        const commentView = document.querySelector(COMMENT_VIEW);
        setComment(commentView);

        document.querySelector(COMMENT_TITLE).append(title.top);
        document.querySelector(COMMENT_SUBTITLE).prepend(title.bottom);
        dispatchAREvent(EVENT_COMMENT_REFRESH);
      }
    });
    observer.observe(comment.parentNode, {
      childList: true,
      subtree: true,
    });
    return () => {
      observer.disconnect();
    };
  }, [comment, title]);

  const handleClick = useCallback(async () => {
    if (!comment) return;

    const newComments = await getNewComment();
    if (newComments) {
      comment.replaceWith(newComments);
      // 입력창이 존재한다면 가져오기 (기존 이벤트들 유지)
      const input = comment.querySelector('form.reply-form');
      if (input) {
        newComments.querySelector('form.reply-form').replaceWith(input);
      }
      newComments.querySelectorAll('time').forEach((time) => {
        // eslint-disable-next-line no-param-reassign
        time.textContent = getDateStr(time.dateTime, 'year-month-day hh:mm:ss');
      });
    }
  }, [comment]);

  return (
    <>
      {title.top && (
        <Portal container={title.top}>
          <IconButton classes={classes} size="small" onClick={handleClick}>
            <Refresh />
          </IconButton>
        </Portal>
      )}
      {title.bottom && (
        <Portal container={title.bottom}>
          <IconButton classes={classes} size="small" onClick={handleClick}>
            <Refresh />
          </IconButton>
        </Portal>
      )}
    </>
  );
}

export default withStyles(style)(CommentRefresh);
