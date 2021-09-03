import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';

import {
  COMMENT_INNER_VIEW,
  COMMENT_LOADED,
  COMMENT_SUBTITLE,
  COMMENT_TITLE,
} from '../$Common/Selector';
import useElementQuery from '../$Common/useElementQuery';
import { getDateStr } from '../$Common/DateHandler';
import { dispatchAREvent, EVENT_COMMENT_REFRESH } from '../$Common/Event';

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
      const titleContainer = document.createElement('span');
      document.querySelector(COMMENT_TITLE).appendChild(titleContainer);
      setTitle(titleContainer);

      const subtitleContainer = document.createElement('span');
      document.querySelector(COMMENT_SUBTITLE).appendChild(subtitleContainer);
      setSubtitle(subtitleContainer);

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
      comment.replaceWith(newComments);
      newComments.querySelectorAll('time').forEach((time) => {
        // eslint-disable-next-line no-param-reassign
        time.textContent = getDateStr(time.dateTime, 'year-month-day hh:mm:ss');
      });
      setComment(newComments);
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
