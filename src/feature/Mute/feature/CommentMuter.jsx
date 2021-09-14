import React, { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import {
  COMMENT_INNER_VIEW,
  COMMENT_ITEMS,
  COMMENT_LOADED,
  COMMENT_WRAPPERS,
} from 'core/selector';
import { useElementQuery } from 'core/hooks';
import { addAREvent, EVENT_COMMENT_REFRESH, removeAREvent } from 'core/event';
import { getUserInfo } from 'util/user';

import { MODULE_ID } from '../ModuleInfo';
import { filterContent } from '../func';
import CountBar from './CountBar';

const useStyles = makeStyles(() => ({
  '@global': {
    '.body #comment': {
      '& .frontend-header': {
        display: 'none',
      },
      '& .list-area': {
        '& .comment-wrapper.filtered': {
          display: 'none',
        },
        '&.show-filtered .comment-wrapper.filtered': {
          display: 'block',
        },
        '&.show-filtered-deleted .comment-wrapper.filtered-deleted': {
          display: 'block',
        },
        '&.show-filtered-keyword .comment-wrapper.filtered-keyword': {
          display: 'block',
        },
        '&.show-filtered-user .comment-wrapper.filtered-user': {
          display: 'block',
        },
      },
    },
  },
  root: {
    '&:empty': {
      display: 'none',
    },
    borderBottom: '1px solid var(--color-border-outer)',
  },
}));

export default function ArticleMuter() {
  const dispatch = useDispatch();
  const commentLoaded = useElementQuery(COMMENT_LOADED);
  const { user, keyword, hideCountBar, muteIncludeReply } = useSelector(
    (state) => state[MODULE_ID],
  );
  const [comment, setComment] = useState(null);
  const [countBar, setCountBar] = useState(null);
  const [count, setCount] = useState(null);

  const classes = useStyles();

  useLayoutEffect(() => {
    if (!commentLoaded) return;

    const tmpComment = document.querySelector(COMMENT_INNER_VIEW);
    if (!tmpComment) return;

    setComment(tmpComment);

    const countHeader = document.createElement('div');
    countHeader.classList.add(classes.root);
    tmpComment.insertAdjacentElement('beforebegin', countHeader);
    setCountBar(countHeader);
  }, [classes, dispatch, commentLoaded]);

  useLayoutEffect(() => {
    if (!comment) return () => {};

    const muteComment = () => {
      const commentList = [
        ...comment.querySelectorAll(
          muteIncludeReply ? COMMENT_WRAPPERS : COMMENT_ITEMS,
        ),
      ];
      const commentInfo = commentList.map((c) => ({
        element: c,
        user: getUserInfo(c.querySelector('.user-info')),
        content: c.querySelector('.message')?.textContent || '',
        category: '',
      }));

      const result = filterContent(commentInfo, user, keyword, {}, {});
      setCount(result);
    };

    window.addEventListener('load', muteComment);
    addAREvent(EVENT_COMMENT_REFRESH, muteComment);

    return () => {
      window.removeEventListener('load', muteComment);
      removeAREvent(EVENT_COMMENT_REFRESH, muteComment);
    };
  }, [comment, keyword, user, muteIncludeReply]);

  if (!countBar || hideCountBar) return null;
  return (
    <CountBar
      renderContainer={countBar}
      classContainer={comment}
      count={count}
    />
  );
}
