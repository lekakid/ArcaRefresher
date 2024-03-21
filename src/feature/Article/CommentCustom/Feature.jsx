import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, GlobalStyles, Portal } from '@mui/material';

import { COMMENT_LOADED, COMMENT } from 'core/selector';
import { EVENT_COMMENT_REFRESH } from 'core/event';
import { useLoadChecker } from 'hooks/LoadChecker';

import { getQuery } from 'func/http';
import Info from './FeatureInfo';

/* eslint-disable react/prop-types */
function UnfoldLongCommentStyles({ value }) {
  if (!value) return null;

  return (
    <GlobalStyles
      styles={{
        '#comment': {
          '& .message': {
            maxHeight: 'none !important',
          },
          '& .btn-more': {
            display: ' none !important',
          },
        },
      }}
    />
  );
}

function ModifiedIndicatorStyles({ value }) {
  if (value) return null;

  return (
    <GlobalStyles
      styles={{
        'b.modified': {
          display: 'none',
        },
      }}
    />
  );
}

function ReverseCommentStyles({ value }) {
  if (!value) return null;

  return (
    <GlobalStyles
      styles={{
        '#comment': {
          display: 'flex',
          flexDirection: 'column',
          '& .title': {
            order: 0,
          },
          '& #commentForm': {
            order: 1,
          },
          '& .list-area': {
            order: 2,
          },
        },
      }}
    />
  );
}

function HideVoiceComment({ value }) {
  if (!value) return null;

  return (
    <GlobalStyles
      styles={{
        '#comment .btn-voicecmt': {
          display: 'none !important',
        },
      }}
    />
  );
}

function ResizeEmoticonPalette({ value }) {
  if (!value) return null;

  return (
    <GlobalStyles
      styles={{
        '.namlacon': {
          height: 'auto !important',
          '& .emoticons': {
            maxHeight: `${value * 100}px !important`,
          },
        },
      }}
    />
  );
}

/* eslint-enable react/prop-types */

const foldingStyles = (
  <GlobalStyles
    styles={{
      '#comment:not(.temp-show)': {
        display: 'none',
      },
    }}
  />
);

export default function CommentCustom() {
  const commentLoaded = useLoadChecker(COMMENT_LOADED);

  const {
    // 모양
    unfoldLongComment,
    modifiedIndicator,
    reverseComment,
    hideVoiceComment,
    resizeEmoticonPalette,
    // 동작
    foldComment,
    wideClickArea,
    alternativeSubmitKey,
  } = useSelector((state) => state[Info.id].storage);
  const [comment, setComment] = useState(null);
  const [unfoldContainer, setUnfoldContainer] = useState(null);
  const [unfold, setUnfold] = useState(false);

  // 댓글 로드 확인 및 엘리먼트 저장
  useEffect(() => {
    if (!commentLoaded) return;

    const changeComment = () => {
      setComment(document.querySelector(COMMENT));
    };
    changeComment();

    window.addEventListener(EVENT_COMMENT_REFRESH, changeComment);
  }, [commentLoaded]);

  // 댓글란 접어두기
  useEffect(() => {
    if (!comment || !foldComment) return;
    if (Object.keys(getQuery()).includes('cp')) return;

    if (!unfoldContainer) {
      const container = document.createElement('div');
      comment.insertAdjacentElement('afterend', container);
      setUnfoldContainer(container);
    }
  }, [comment, foldComment, unfoldContainer]);

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

  // 댓글 키 입력 변경
  useEffect(() => {
    if (!comment) return undefined;
    if (!alternativeSubmitKey) return undefined;

    const handler = (e) => {
      if (!e.target.matches('[name="content"]')) return;

      if (e.key === 'Enter') {
        e.stopPropagation();
        if (e[alternativeSubmitKey]) {
          e.preventDefault();
          e.target.closest('form').querySelector('[type="submit"]').click();
        }
      }
    };

    document.body.addEventListener('keydown', handler, true);
    return () => {
      document.body.removeEventListener('keydown', handler, true);
    };
  }, [alternativeSubmitKey, comment]);

  return (
    <>
      <UnfoldLongCommentStyles value={unfoldLongComment} />
      <ModifiedIndicatorStyles value={modifiedIndicator} />
      <ReverseCommentStyles value={reverseComment} />
      <HideVoiceComment value={hideVoiceComment} />
      <ResizeEmoticonPalette value={resizeEmoticonPalette} />
      {foldComment && unfoldContainer && !unfold && (
        <Portal container={unfoldContainer}>
          {foldingStyles}
          <Button fullWidth onClick={() => setUnfold(true)}>
            댓글 펼치기
          </Button>
        </Portal>
      )}
    </>
  );
}
