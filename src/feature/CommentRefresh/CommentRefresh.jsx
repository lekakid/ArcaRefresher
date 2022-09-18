import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IconButton, Portal } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Refresh } from '@material-ui/icons';

import {
  COMMENT_VIEW,
  COMMENT_LOADED,
  COMMENT_TITLE,
  COMMENT_SUBTITLE,
  COMMENT_INNER_VIEW,
} from 'core/selector';
import { useElementQuery } from 'core/hooks';
import { dispatchAREvent, EVENT_COMMENT_REFRESH } from 'core/event';
import { getDateStr } from 'func/time';

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
  const comment = useRef(undefined);
  const commentLoaded = useElementQuery(COMMENT_LOADED);

  // 초기화
  useEffect(() => {
    if (!commentLoaded) return;

    const initComment = document.querySelector(COMMENT_INNER_VIEW);
    comment.current = initComment;
    const top = document.createElement('span');
    const bottom = document.createElement('span');
    document.querySelector(COMMENT_TITLE)?.append(top);
    document.querySelector(COMMENT_SUBTITLE)?.prepend(bottom);

    setTitle({ top, bottom });
  }, [commentLoaded]);

  useEffect(() => {
    if (!commentLoaded) return;

    const observer = new MutationObserver(() => {
      if (comment.current.parentElement) return;

      comment.current = document.querySelector(COMMENT_INNER_VIEW);
      dispatchAREvent(EVENT_COMMENT_REFRESH);
    });
    observer.observe(comment.current.closest(COMMENT_VIEW), {
      childList: true,
      subtree: true,
    });
  }, [commentLoaded]);

  const handleClick = useCallback(async () => {
    const response = await fetch(window.location.href);
    if (!response.ok) {
      console.warn('[CommentRefresh] 네트워크 오류');
      return;
    }

    const text = await response.text();
    const parser = new DOMParser();
    const resultDocument = parser.parseFromString(text, 'text/html');
    const newComments = resultDocument.querySelector(COMMENT_INNER_VIEW);
    if (!newComments) return;

    newComments.querySelectorAll('time').forEach((time) => {
      // eslint-disable-next-line no-param-reassign
      time.textContent = getDateStr(time.dateTime, 'year-month-day hh:mm:ss');
    });

    comment.current.replaceWith(newComments);
  }, []);

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
