import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';

import {
  COMMENT_INNER_VIEW,
  COMMENT_LOADED,
  COMMENT_SUBTITLE,
  COMMENT_TITLE,
} from 'core/selector';
import { useElementQuery } from 'core/hooks';
import { dispatchAREvent, EVENT_COMMENT_REFRESH } from 'core/event';
import { getDateStr } from 'util/time';

import getNewComment from './getNewComment';
import RefreshButton from './RefreshButton';

const useStyles = makeStyles({
  '@global': {
    '#comment .list-area:empty': {
      display: 'none',
    },
    '#comment .list-area:empty + .write-area': {
      borderTop: 'inherit',
    },
  },
});

export default function CommentRefresh() {
  const [title, setTitle] = useState(null);
  const [subtitle, setSubtitle] = useState(null);
  const [comment, setComment] = useState(null);
  const commentLoaded = useElementQuery(COMMENT_LOADED);
  useStyles();

  useEffect(() => {
    if (commentLoaded) {
      setTitle(
        document
          .querySelector(COMMENT_TITLE)
          ?.appendChild(document.createElement('span')) || null,
      );
      setSubtitle(
        document
          .querySelector(COMMENT_SUBTITLE)
          ?.appendChild(document.createElement('span')) || null,
      );

      const commentContainer =
        document.querySelector(COMMENT_INNER_VIEW) ||
        document.createElement('div');
      if (!commentContainer.parentNode) {
        commentContainer.classList.add('list-area');
        document
          .querySelector(COMMENT_TITLE)
          .insertAdjacentElement('afterend', commentContainer);
      }
      setComment(commentContainer);
    }
  }, [commentLoaded]);

  const handleClick = useCallback(async () => {
    if (!comment) return;

    const newComments = await getNewComment();
    if (newComments) {
      comment.innerHTML = newComments.innerHTML;
      newComments.querySelectorAll('time').forEach((time) => {
        // eslint-disable-next-line no-param-reassign
        time.textContent = getDateStr(time.dateTime, 'year-month-day hh:mm:ss');
      });
      dispatchAREvent(EVENT_COMMENT_REFRESH);
    }
  }, [comment]);

  return (
    <>
      <RefreshButton container={title} onClick={handleClick} />
      <RefreshButton container={subtitle} onClick={handleClick} />
    </>
  );
}
