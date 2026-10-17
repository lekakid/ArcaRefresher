import { useEffect, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Portal } from '@mui/material';

import store from 'core/store';
import { useLoadChecker } from 'hooks/LoadChecker';
import { EVENT_COMMENT_REFRESH } from 'core/event';
import { COMMENT_LOADED, COMMENT } from 'core/selector';

import info from './info';

const styleEl = document.createElement('style');
document.body.append(styleEl);

function applyStyle(storage) {
  const {
    unfoldLongComment,
    modifiedIndicator,
    reverseComment,
    hideVoiceComment,
  } = storage;

  const styles = [];

  // 긴 댓글 자동 펼치기
  if (unfoldLongComment) {
    styles.push(`
      #comment .message { max-height: none !important; }
      #comment .btn-more { display: none !important; }
    `);
  }

  // * 수정됨 표시
  if (!modifiedIndicator) {
    styles.push(`
      b.modified { display: none; }
    `);
  }

  // 댓글 입력창을 제일 위로
  if (reverseComment) {
    styles.push(`
      #comment { display: flex; flex-direction: column; }
      #comment .title { order: 0 }
      #comment #commentForm { order: 1 }
      #comment .list-area { order: 2 }
    `);
  }

  // 음성 댓글 숨기기
  if (hideVoiceComment) {
    styles.push(`
      #comment .btn-voicecmt { display: none !important; }
    `);
  }

  // 댓글 접어두기 기능
  styles.push(`
    #comment.fold-comment:not(.temp-show) { display: none; }
  `);

  styleEl.textContent = styles.join('\n\n');
}
applyStyle(store.getState()[info.id].storage);

const unfoldContainer = document.createElement('div');
unfoldContainer.style = 'margin-bottom: .5rem';

export default function CommentCustom() {
  const commentLoaded = useLoadChecker(COMMENT_LOADED);

  const {
    // 동작
    foldComment,
    wideClickArea,
    alternativeSubmitKey,
    ...storage
  } = useSelector((state) => state[info.id].storage);

  const [comment, setComment] = useState(null);

  // 스타일 적용
  useLayoutEffect(() => {
    applyStyle(storage);
  }, [storage]);

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
    if (!foldComment) return;
    if (!comment) return;

    // 댓글 탐색 중
    const search = new URLSearchParams(window.location.search);
    if (search.has('cp')) return;

    comment.insertAdjacentElement('afterend', unfoldContainer);
    comment.classList.toggle('fold-comment', true);
    comment.classList.toggle('temp-show', false);

    return () => {
      comment.classList.remove('fold-comment');
      comment.classList.remove('temp-show');
    };
  }, [comment, foldComment]);

  // 넓은 답글창 열기
  useEffect(() => {
    if (!comment || !wideClickArea) return undefined;

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

    const handler = (e) => {
      if (!e.target.matches('[name="content"]')) return;

      if (e.key === 'Enter') {
        e.stopPropagation();
        if (!alternativeSubmitKey && !e.shiftKey) {
          e.preventDefault();
          e.target.closest('form').querySelector('[type="submit"]').click();
        }
        if (alternativeSubmitKey && e[alternativeSubmitKey]) {
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
      {foldComment && (
        <Portal container={unfoldContainer}>
          <Button
            fullWidth
            onClick={() => {
              comment.classList.toggle('temp-show', true);
              unfoldContainer.remove();
            }}
          >
            댓글 펼치기
          </Button>
        </Portal>
      )}
    </>
  );
}
