import React, { useCallback, useEffect, useState } from 'react';
import { IconButton } from '@material-ui/core';
import { Refresh } from '@material-ui/icons';

import {
  COMMENT_INNER_VIEW,
  COMMENT_LOADED,
  COMMENT_TITLE,
} from '../$Common/Selector';
import { dispatchAREvent, EVENT_COMMENT_REFRESH } from '../$Common/Event';
import useElementQuery from '../$Common/useElementQuery';

import getNewComment from './comment';

export default function RefreshButton() {
  const [comment, setComment] = useState(null);
  const commentLoaded = useElementQuery(COMMENT_LOADED);

  useEffect(() => {
    if (commentLoaded) {
      const currentContainer =
        document.querySelector(COMMENT_INNER_VIEW) ||
        document.createElement('div');
      if (!currentContainer.parentNode) {
        currentContainer.classList.add('list-area');
        document
          .querySelector(COMMENT_TITLE)
          .insertAdjacentElement('afterend', currentContainer);
      }
      setComment(currentContainer);
    }
  }, [commentLoaded]);

  const onClick = useCallback(async () => {
    if (!comment) return;

    const newComments = await getNewComment();
    if (newComments) {
      comment.replaceWith(newComments);
      dispatchAREvent(EVENT_COMMENT_REFRESH);
    }
  }, [comment]);

  return (
    <IconButton size="small" onClick={onClick}>
      <Refresh />
    </IconButton>
  );
}
