import React, { useCallback, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/styles';

import {
  COMMENT_VIEW,
  COMMENT_LOADED,
  COMMENT_SUBTITLE,
  COMMENT_TITLE,
} from 'core/selector';
import { useElementQuery } from 'core/hooks';
import { dispatchAREvent, EVENT_COMMENT_REFRESH } from 'core/event';
import { getDateStr } from 'util/time';

import getNewComment from './getNewComment';
import RefreshButton from './RefreshButton';

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
};

function CommentRefresh() {
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
      setTitle({
        top:
          document
            .querySelector(COMMENT_TITLE)
            ?.appendChild(document.createElement('span')) || null,
        bottom:
          document
            .querySelector(COMMENT_SUBTITLE)
            ?.appendChild(document.createElement('span')) || null,
      });
    }
  }, [commentLoaded]);

  useEffect(() => {
    if (!comment) return undefined;

    const observer = new MutationObserver(() => {
      if (!comment.parentNode) {
        const commentView = document.querySelector(COMMENT_VIEW);
        setComment(commentView);

        document.querySelector(COMMENT_TITLE).appendChild(title.top);
        document.querySelector(COMMENT_SUBTITLE).appendChild(title.bottom);
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
      newComments.querySelectorAll('time').forEach((time) => {
        // eslint-disable-next-line no-param-reassign
        time.textContent = getDateStr(time.dateTime, 'year-month-day hh:mm:ss');
      });
      unsafeWindow.articleLoad({});
    }
  }, [comment]);

  return (
    <>
      <RefreshButton container={title.top} onClick={handleClick} />
      <RefreshButton container={title.bottom} onClick={handleClick} />
    </>
  );
}

export default withStyles(style)(CommentRefresh);
