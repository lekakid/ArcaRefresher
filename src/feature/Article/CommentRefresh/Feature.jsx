import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IconButton, Portal } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Refresh } from '@material-ui/icons';

import {
  COMMENT,
  COMMENT_TITLE,
  COMMENT_SUBTITLE,
  COMMENT_INNER,
  COMMENT_LOADED,
} from 'core/selector';
import { EVENT_COMMENT_REFRESH, useDispatchEvent } from 'hooks/Event';
import { useLoadChecker } from 'hooks/LoadChecker';
import toDocument from 'func/toDocument';

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
  const dispatchEvent = useDispatchEvent(EVENT_COMMENT_REFRESH);
  const commentLoaded = useLoadChecker(COMMENT_LOADED);

  const [title, setTitle] = useState({
    top: undefined,
    bottom: undefined,
  });
  const comment = useRef(undefined);

  // 초기화
  useEffect(() => {
    if (!commentLoaded) return;

    const initComment = document.querySelector(COMMENT_INNER);
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

      comment.current = document.querySelector(COMMENT_INNER);
      dispatchEvent(EVENT_COMMENT_REFRESH);
    });
    observer.observe(comment.current.closest(COMMENT), {
      childList: true,
      subtree: true,
    });
  }, [commentLoaded, dispatchEvent]);

  const handleClick = useCallback(async () => {
    const response = await fetch(window.location.href);
    if (!response.ok) {
      console.warn('[CommentRefresh] 네트워크 오류');
      return;
    }

    const text = await response.text();
    const resultDocument = toDocument(text);
    const newComments = resultDocument.querySelector(COMMENT_INNER);
    if (!newComments) return;

    comment.current.replaceWith(newComments);
    unsafeWindow.applyLocalTimeFix();
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
