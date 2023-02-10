import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Portal,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import {
  ARTICLE_GIFS,
  ARTICLE_IMAGES,
  ARTICLE_LOADED,
  ARTICLE,
  BOARD_NOTICES,
  BOARD_ITEMS,
  BOARD_LOADED,
  BOARD,
  BOARD_IN_ARTICLE,
  COMMENT_LOADED,
  COMMENT,
} from 'core/selector';
import {
  addAREvent,
  removeAREvent,
  EVENT_AUTOREFRESH,
  EVENT_COMMENT_REFRESH,
} from 'core/event';
import { useLoadChecker } from 'util/LoadChecker';

import Info from './FeatureInfo';
import CommentButton from './CommentButton';

const useStyles = makeStyles(() => ({
  comment: {
    '& #comment:not(.temp-show)': {
      display: 'none',
    },
    '& #comment.temp-show + .unfold-button-container': {
      display: 'none',
    },
  },
}));

const WAITING = 'WAITING';
const CONFIRM = 'CONFIRM';
const IGNORE = 'IGNORE';

export default function ExperienceCustomizer() {
  const {
    storage: {
      spoofTitle,
      openArticleNewWindow,
      blockMediaNewWindow,
      ignoreExternalLinkWarning,
      ratedownGuard,
      foldComment,
      wideClickArea,
    },
  } = useSelector((state) => state[Info.ID]);
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);
  const boardLoaded = useLoadChecker(BOARD_LOADED);
  const commentLoaded = useLoadChecker(COMMENT_LOADED);

  const titleRef = useRef(document.title);
  const [article, setArticle] = useState(null);
  const [comment, setComment] = useState(null);
  const [unfoldContainer, setUnfoldContainer] = useState(null);
  const [confirm, setConfirm] = useState(WAITING);
  const classes = useStyles();

  useEffect(() => {
    document.title = spoofTitle || titleRef.current;
  }, [spoofTitle]);

  useEffect(() => {
    if (articleLoaded) {
      setArticle(document.querySelector(ARTICLE));
    }
  }, [articleLoaded]);

  useEffect(() => {
    if (!article || !blockMediaNewWindow) return;

    article
      .querySelectorAll(`${ARTICLE_IMAGES}, ${ARTICLE_GIFS}`)
      .forEach((i) => {
        const a = document.createElement('a');
        i.insertAdjacentElement('beforebegin', a);
        a.append(i);
      });
  }, [article, blockMediaNewWindow]);

  useEffect(() => {
    if (!article || !ignoreExternalLinkWarning) return;

    article.querySelectorAll('a.external').forEach((e) => {
      e.href = e.href.replace('https://oo.pe/', '');
      e.classList.remove('external');
    });
  }, [article, ignoreExternalLinkWarning]);

  useEffect(() => {
    if (!article || !ratedownGuard) return null;

    const ratedownButton = article.querySelector('#rateDown');
    if (!ratedownButton) return null;

    const ratedownClick = (e) => {
      setConfirm((prev) => {
        if (prev === WAITING) {
          e.preventDefault();
          return CONFIRM;
        }
        return WAITING;
      });
    };

    ratedownButton.addEventListener('click', ratedownClick);
    return () => ratedownButton.removeEventListener('click', ratedownClick);
  }, [article, ratedownGuard]);

  useEffect(() => {
    if (!commentLoaded) return;

    setComment(document.querySelector(COMMENT));
    addAREvent(EVENT_COMMENT_REFRESH, () => {
      setComment(document.querySelector(COMMENT));
    });
  }, [commentLoaded]);

  useEffect(() => {
    if (!boardLoaded || !openArticleNewWindow) return null;

    const board = document.querySelector(`${BOARD}, ${BOARD_IN_ARTICLE}`);
    const applyNewWindow = () => {
      const articles = board.querySelectorAll(
        `${BOARD_NOTICES}, ${BOARD_ITEMS}`,
      );
      articles.forEach((a) => {
        a.setAttribute('target', '_blank');
      });
    };

    applyNewWindow();
    addAREvent(EVENT_AUTOREFRESH, applyNewWindow);
    return () => {
      const articles = board.querySelectorAll(
        `${BOARD_NOTICES}, ${BOARD_ITEMS}`,
      );
      articles.forEach((a) => {
        a.setAttribute('target', '');
      });

      removeAREvent(EVENT_AUTOREFRESH, applyNewWindow);
    };
  }, [boardLoaded, openArticleNewWindow]);

  useEffect(() => {
    if (!comment || !foldComment) return null;

    if (!unfoldContainer) {
      const container = document.createElement('div');
      container.classList.add('unfold-button-container');
      comment.insertAdjacentElement('afterend', container);
      setUnfoldContainer(container);
      return null;
    }

    document.documentElement.classList.add(classes.comment);
    return () => document.documentElement.classList.remove(classes.comment);
  }, [classes, comment, foldComment, unfoldContainer]);

  useEffect(() => {
    if (!comment || !wideClickArea) return null;

    const handleClick = (e) => {
      if (e.target.closest('form')) return;

      const target = e.target.closest('a, .emoticon, .btn-more, .message');
      if (!target?.classList.contains('message')) return;

      e.preventDefault();

      target.parentNode.querySelector('.reply-link').click();
    };

    comment.addEventListener('click', handleClick);
    return () => comment.removeEventListener('click', handleClick);
  }, [comment, wideClickArea]);

  const handleConfirm = useCallback(() => {
    setConfirm(IGNORE);

    article.querySelector('#rateDown').click();
  }, [article]);

  const handleClose = useCallback(() => {
    setConfirm(WAITING);
  }, []);

  return (
    <>
      <Dialog open={confirm === CONFIRM} onClose={handleClose}>
        <DialogTitle>비추천 재확인</DialogTitle>
        <DialogContent>
          비추천을 누르셨습니다. 진짜 비추천하시겠습니까?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm}>예</Button>
          <Button onClick={handleClose}>아니오</Button>
        </DialogActions>
      </Dialog>
      {unfoldContainer && foldComment && (
        <Portal container={unfoldContainer}>
          <CommentButton className="unfold-comment" />
        </Portal>
      )}
    </>
  );
}
