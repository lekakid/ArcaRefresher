import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Portal,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { ZoomIn } from '@material-ui/icons';

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

const PREVIEW_SELECTOR = '.article-content img, .article-content video';

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

export default function ExperienceCustomizer() {
  const {
    spoofTitle,
    openArticleNewWindow,
    blockMediaNewWindow,
    ignoreExternalLinkWarning,
    ratedownGuard,
    foldComment,
    wideClickArea,
    enhancedArticleManage,
  } = useSelector((state) => state[Info.ID].storage);
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);
  const boardLoaded = useLoadChecker(BOARD_LOADED);
  const commentLoaded = useLoadChecker(COMMENT_LOADED);

  const titleRef = useRef(document.title);
  const [article, setArticle] = useState(null);
  const [comment, setComment] = useState(null);
  const [unfoldContainer, setUnfoldContainer] = useState(null);
  const confirmRef = useRef();
  const [confirm, setConfirm] = useState(false);
  const [fakePreview, setFakePreview] = useState(null);
  const classes = useStyles();

  // 게시물 로드 확인 및 엘리먼트 저장
  useEffect(() => {
    if (articleLoaded) {
      setArticle(document.querySelector(ARTICLE));
    }
  }, [articleLoaded]);

  // 댓글 로드 확인 및 엘리먼트 저장
  useEffect(() => {
    if (!commentLoaded) return;

    setComment(document.querySelector(COMMENT));
    addAREvent(EVENT_COMMENT_REFRESH, () => {
      setComment(document.querySelector(COMMENT));
    });
  }, [commentLoaded]);

  // 사이트 표시 제목 변경
  useEffect(() => {
    document.title = spoofTitle || titleRef.current;
  }, [spoofTitle]);

  // 이미지, 영상 새 창에서 열기 방지
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

  // 외부 링크 경고 무시
  useEffect(() => {
    if (!article || !ignoreExternalLinkWarning) return;

    article.querySelectorAll('a.external').forEach((e) => {
      e.href = e.href.replace('https://oo.pe/', '');
      e.classList.remove('external');
    });
  }, [article, ignoreExternalLinkWarning]);

  // 비추천 방지
  const handleConfirm = useCallback(
    (value) => async () => {
      if (!confirmRef.current) return; // ?
      setConfirm(false);
      confirmRef.current(value);
    },
    [],
  );

  useEffect(() => {
    if (!article || !ratedownGuard) return null;

    const ratedownButton = article.querySelector('#rateDown');
    if (!ratedownButton) return null;

    const ratedownClick = async (e) => {
      if (confirmRef.current) {
        // 이미 비추천 막고 있음
        confirmRef.current = undefined;
        return;
      }

      e.preventDefault();
      setConfirm(true);
      const value = await new Promise((resolve) => {
        confirmRef.current = resolve;
      });

      if (value) {
        ratedownButton.click();
        return;
      }
      confirmRef.current = undefined;
    };

    ratedownButton.addEventListener('click', ratedownClick);
    return () => ratedownButton.removeEventListener('click', ratedownClick);
  }, [article, handleConfirm, ratedownGuard]);

  // 게시판 새 창 열기 방지
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

  // 댓글 접기 방지
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

  // 넓은 답글창 열기
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

  // 미리보기 훼이크 걷어내기
  useEffect(() => {
    if (!article) return;

    const preview = article.querySelector(PREVIEW_SELECTOR);
    if (!preview) return;

    if (preview.clientWidth < 10 && preview.clientHeight < 10) {
      const alterParent = document.createElement('span');
      preview.parentElement.insertAdjacentElement('afterbegin', alterParent);
      alterParent.append(preview);
      const container = document.createElement('span');
      preview.parentElement.insertAdjacentElement('afterbegin', container);
      setFakePreview({ container, preview });
    }
  }, [article]);

  const handleFakePreview = useCallback(() => {
    setFakePreview(({ preview, container }) => {
      preview.style = { width: '', height: '' };
      preview.parentElement.replaceWith(preview);
      container.remove();
    });
  }, []);

  // 게시물 관리 UX 개선
  useEffect(() => {
    if (!boardLoaded) return undefined;
    if (!enhancedArticleManage) return undefined;
    if (!document.querySelector('.article-list.admin')) return undefined;

    const board = document.querySelector(BOARD);
    let selectedElement;
    let value = false;
    let dragged = false;

    const dragStartHandler = (e) => {
      if (e.button !== 0) return;

      const row = e.target.closest('a.vrow:not(.notice)');
      if (!row) return;

      selectedElement = row;
      const check = row.querySelector('input[type="checkbox"]');
      value = !check.checked;
    };
    const dragEndHandler = (e) => {
      if (e.button !== 0) return;

      selectedElement = undefined;
    };
    const clickHandler = (e) => {
      if (e.target.matches('input[type="checkbox"]')) return;
      if (dragged) {
        e.preventDefault();
        dragged = false;
      }

      const row = e.target.closest('a.vrow:not(.notice)');
      if (!row) return;

      if (e.pageX < row.offsetLeft + 35 && e.pageY < row.offsetTop + 35) {
        e.preventDefault();
        const check = row.querySelector('input[type="checkbox"]');
        if (check.checked !== value) {
          check.click();
        }
      }
    };
    const draggingHandler = (e) => {
      if (!selectedElement) return;
      e.preventDefault();

      const row = e.target.closest('a.vrow:not(.notice)');
      if (!row || selectedElement === row) return;

      const selectedCheck = selectedElement.querySelector(
        'input[type="checkbox"]',
      );
      if (selectedCheck.checked !== value) {
        selectedCheck.click();
        dragged = true;
      }

      const check = row.querySelector('input[type="checkbox"]');
      if (check.checked !== value) {
        check.click();
      }
    };
    board.addEventListener('click', clickHandler);
    board.addEventListener('mousedown', dragStartHandler);
    board.addEventListener('mouseup', dragEndHandler);
    board.addEventListener('mousemove', draggingHandler);
    return () => {
      board.addEventListener('click', clickHandler);
      board.removeEventListener('mousedown', dragStartHandler);
      board.addEventListener('mouseup', dragEndHandler);
      board.addEventListener('mousemove', draggingHandler);
    };
  }, [boardLoaded, enhancedArticleManage]);

  return (
    <>
      <Dialog open={confirm} onClose={handleConfirm(false)}>
        <DialogTitle>비추천 재확인</DialogTitle>
        <DialogContent>
          비추천을 누르셨습니다. 진짜 비추천하시겠습니까?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm(true)}>예</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm(false)}
          >
            아니오
          </Button>
        </DialogActions>
      </Dialog>
      {unfoldContainer && foldComment && (
        <Portal container={unfoldContainer}>
          <CommentButton className="unfold-comment" />
        </Portal>
      )}
      {fakePreview && (
        <Portal container={fakePreview.container}>
          <Tooltip placement="right" title="미리보기 확대">
            <IconButton onClick={handleFakePreview}>
              <ZoomIn />
            </IconButton>
          </Tooltip>
        </Portal>
      )}
    </>
  );
}
