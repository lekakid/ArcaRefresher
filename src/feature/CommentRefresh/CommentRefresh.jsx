import React, { useCallback, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/styles';

import { COMMENT_VIEW, COMMENT_LOADED, COMMENT_TITLE } from 'core/selector';
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
  const [title, setTitle] = useState(undefined);
  const [comment, setComment] = useState(undefined);
  const commentLoaded = useElementQuery(COMMENT_LOADED);

  // 초기화
  useEffect(() => {
    if (commentLoaded) {
      const commentView = document.querySelector(COMMENT_VIEW);
      setComment(commentView);
      setTitle(
        document
          .querySelector(COMMENT_TITLE)
          ?.appendChild(document.createElement('span')) || null,
      );
    }
  }, [commentLoaded]);

  useEffect(() => {
    if (!comment) return undefined;

    const observer = new MutationObserver(() => {
      if (!comment.parentNode) {
        const commentView = document.querySelector(COMMENT_VIEW);
        setComment(commentView);

        document.querySelector(COMMENT_TITLE).appendChild(title);
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

  return <RefreshButton container={title} onClick={handleClick} />;
}

export default withStyles(style)(CommentRefresh);
