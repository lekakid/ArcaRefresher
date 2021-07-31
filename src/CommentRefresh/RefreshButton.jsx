import React, { useCallback, useState } from 'react';
import { IconButton } from '@material-ui/core';
import { Refresh } from '@material-ui/icons';

import useAwaitElement from '../$Common/AwaitElement';
import {
  COMMENT_INNER_VIEW,
  COMMENT_LOADED,
  COMMENT_TITLE,
} from '../$Common/Selector';
import { EVENT_COMMENT_REFRESH } from '../$Common/Event';

import getNewComment from './comment';

export default function RefreshButton() {
  const [container, setContainer] = useState(null);

  useAwaitElement(COMMENT_LOADED, () => {
    let currentContainer = document.querySelector(COMMENT_INNER_VIEW);
    if (!currentContainer) {
      currentContainer = document.createElement('div');
      currentContainer.classList.add('list-area');
      document
        .querySelector(COMMENT_TITLE)
        .insertAdjacentElement('afterend', currentContainer);
    }
    setContainer(currentContainer);
  });

  const onClick = useCallback(async () => {
    if (!container) return;

    const newComments = await getNewComment();
    if (newComments) {
      container.replaceWith(newComments);
      document.dispatchEvent(new Event(EVENT_COMMENT_REFRESH));
    }
  }, [container]);

  return (
    <IconButton size="small" onClick={onClick}>
      <Refresh />
    </IconButton>
  );
}
