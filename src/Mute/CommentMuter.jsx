import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import {
  COMMENT_INNER_VIEW,
  COMMENT_ITEMS,
  COMMENT_LOADED,
} from '../$Common/Selector';
import useElementQuery from '../$Common/useElementQuery';
import {
  addAREvent,
  EVENT_COMMENT_REFRESH,
  removeAREvent,
} from '../$Common/Event';
import { getUserInfo } from '../$Common/Parser';

import { MODULE_ID } from './ModuleInfo';
import CountBar from './CountBar';
import filterContent from './filterContent';

const useStyles = makeStyles(() => ({
  '@global': {
    '.body #comment .frontend-header': {
      display: 'none',
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
  const { user, keyword, hideCountBar } = useSelector(
    (state) => state[MODULE_ID],
  );
  const [comment, setComment] = useState(null);
  const [countBar, setCountBar] = useState(null);
  const [count, setCount] = useState({});
  const [btnState, setBtnState] = useState({});

  const classes = useStyles();

  useEffect(() => {
    if (!commentLoaded) return;

    const tmpComment = document.querySelector(COMMENT_INNER_VIEW);
    if (!tmpComment) return;

    setComment(tmpComment);

    const countHeader = document.createElement('div');
    countHeader.classList.add(classes.root);
    tmpComment.insertAdjacentElement('beforebegin', countHeader);
    setCountBar(countHeader);
  }, [classes, dispatch, commentLoaded]);

  useEffect(() => {
    if (!comment) return null;

    const muteComment = () => {
      const commentList = [...comment.querySelectorAll(COMMENT_ITEMS)];
      const commentInfo = commentList.map((c) => ({
        element: c,
        user: getUserInfo(c.querySelector('.user-info')),
        content: c.querySelector('.message')?.textContent || '',
        category: '',
      }));

      const result = filterContent(commentInfo, user, keyword, {}, {});
      setCount(result);
      setBtnState(
        Object.keys(result).reduce((acc, cur) => ({ ...acc, [cur]: false })),
      );
    };

    window.addEventListener('load', muteComment);
    addAREvent(EVENT_COMMENT_REFRESH, muteComment);

    return () => {
      window.removeEventListener('load', muteComment);
      removeAREvent(EVENT_COMMENT_REFRESH, muteComment);
    };
  }, [comment, keyword, user]);

  const handleClick = useCallback(
    (key) => () => {
      const suffix = key === 'all' ? '' : `-${key}`;
      const className = `show-filtered${suffix}`;
      comment.classList.toggle(className);
      setBtnState((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    },
    [comment],
  );

  if (!commentLoaded || !countBar) return null;
  if (hideCountBar || count.all === 0) return null;

  return (
    <CountBar
      container={countBar}
      count={count}
      btnState={btnState}
      onClick={handleClick}
    />
  );
}
