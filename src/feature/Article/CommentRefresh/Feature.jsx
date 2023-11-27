import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GlobalStyles, IconButton, Portal } from '@mui/material';
import { Refresh } from '@mui/icons-material';

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

const commentRefreshStyles = (
  <GlobalStyles
    styles={{
      '.reply-form__user-info': {
        alignItems: 'center',
      },
    }}
  />
);

function CommentRefresh() {
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
      {commentRefreshStyles}
      {title.top && (
        <Portal container={title.top}>
          <IconButton
            size="small"
            sx={{ color: 'var(--color-text-muted)' }}
            onClick={handleClick}
          >
            <Refresh />
          </IconButton>
        </Portal>
      )}
      {title.bottom && (
        <Portal container={title.bottom}>
          <IconButton
            size="small"
            sx={{ color: 'var(--color-text-muted)' }}
            onClick={handleClick}
          >
            <Refresh />
          </IconButton>
        </Portal>
      )}
    </>
  );
}

export default CommentRefresh;
