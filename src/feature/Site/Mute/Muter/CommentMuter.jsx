import { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalStyles } from '@mui/material';

import {
  COMMENT_INNER,
  COMMENT_ITEMS,
  COMMENT_WRAPPERS,
  COMMENT_LOADED,
} from 'core/selector';
import { EVENT_COMMENT_REFRESH } from 'core/event';
import { useLoadChecker } from 'hooks/LoadChecker';
import { ArcaUser } from 'func/user';
import { serializeText } from 'func/emoji';

import Info from '../FeatureInfo';
import { filterContent } from '../func';
import CountBar from './CountBar';
import { filterSelector } from '../selector';

const commentMuteStyles = (
  <GlobalStyles
    styles={{
      '.body #comment': {
        // 아카라이브 고유 뮤트 메뉴 숨김
        '& .frontend-header': {
          display: 'none',
        },
        '& div.list-area': {
          // 임시 해제 시 흐릿하게
          '& .muted, & .filtered': {
            '& .info-row .user-info a': {
              color: 'var(--color-text-muted) !important',
            },
            '& .message': {
              '& img, & video': {
                opacity: '.5',
              },
              '& .text pre': {
                color: 'var(--color-text-muted) !important',
              },
              color: 'var(--color-text-muted) !important',
            },
          },
          // 필터링
          '& .filtered': {
            display: 'none',
          },
          '&.show-filtered .filtered': {
            display: 'block',
          },
          '&.show-filtered-deleted .filtered-deleted': {
            display: 'block',
          },
          '&.show-filtered-keyword .filtered-keyword': {
            display: 'block',
          },
          '&.show-filtered-user .filtered-user': {
            display: 'block',
          },
          '&.show-filtered-emoticon .filtered-emoticon': {
            display: 'block',
          },
          // 뮤트
          '&:not(.show-filtered)': {
            '&:not(.show-filtered-keyword) .muted-keyword': {
              '& .message > *:not(.btn-more)': {
                display: 'none',
              },
              '&.comment-wrapper .message:after, &.comment-item .message:after':
                {
                  content: '"[키워드 뮤트]"',
                },
              '&.comment-wrapper .comment-wrapper .message:after': {
                content: '"[답글 뮤트]"',
              },
            },
            '&:not(.show-filtered-user) .muted-user': {
              '& .message > *:not(.btn-more)': {
                display: 'none',
              },
              '&.comment-wrapper .message:after, &.comment-item .message:after':
                {
                  content: '"[이용자 뮤트]"',
                },
              '&.comment-wrapper .comment-wrapper .message:after': {
                content: '"[답글 뮤트]"',
              },
            },
            '&:not(.show-filtered-emoticon) .muted-emoticon': {
              '& .message > *:not(.btn-more)': {
                display: 'none',
              },
              '&.comment-wrapper .message:after, &.comment-item .message:after':
                {
                  content: '"[아카콘 뮤트]"',
                },
              '&.comment-wrapper .comment-wrapper .message:after': {
                content: '"[답글 뮤트]"',
              },
            },
          },
        },
      },
    }}
  />
);

function CommentMuter() {
  const dispatch = useDispatch();
  const commentLoaded = useLoadChecker(COMMENT_LOADED);

  const filter = useSelector(filterSelector);
  const { hideCountBar, hideMutedMark, muteIncludeReply, muteAllEmot } =
    useSelector((state) => state[Info.id].storage);
  const [controlTarget, setControlTarget] = useState(undefined);
  const [countBarContainer, setCountBarContainer] = useState(undefined);
  const [count, setCount] = useState(undefined);

  // 댓글 창 로드 검사 및 컨테이너 생성
  useLayoutEffect(() => {
    if (!commentLoaded) return;

    const commentElement = document.querySelector(COMMENT_INNER);
    if (!commentElement) return;

    setControlTarget(commentElement);

    const container = document.createElement('div');
    commentElement.insertAdjacentElement('beforebegin', container);
    setCountBarContainer(container);

    const changeTarget = () => {
      const refreshedComment = document.querySelector(COMMENT_INNER);
      setControlTarget(refreshedComment);
      refreshedComment.insertAdjacentElement('beforebegin', container);
    };

    window.addEventListener(EVENT_COMMENT_REFRESH, changeTarget);
  }, [dispatch, commentLoaded]);

  // 뮤트 처리
  useLayoutEffect(() => {
    if (!controlTarget) return undefined;

    const muteComment = () => {
      const comments = [...document.querySelectorAll(COMMENT_WRAPPERS)];
      const commentInfos = comments.map((wrapper) => {
        const item = wrapper.querySelector('.comment-item');
        const deleted = item.classList.contains('deleted');
        const element = !deleted && muteIncludeReply ? wrapper : item;
        const user = new ArcaUser(wrapper.querySelector('.user-info')).toUID();
        const content = serializeText(wrapper.querySelector('.message pre'));
        const emoticon = muteAllEmot
          ? [-1]
          : [...item.querySelectorAll('.message .emoticon')].map(
              (i) => i.dataset.id,
            );

        return {
          element,
          user,
          content,
          emoticon,
          deleted,
        };
      });

      const filteredList = filterContent(commentInfos, filter);
      const result = Object.fromEntries(
        Object.entries(filteredList).map(([key, value]) => {
          if (key !== 'all') {
            value.forEach((e) => {
              if (key === 'deleted' || hideMutedMark) {
                e.classList.add('filtered');
                e.classList.add(`filtered-${key}`);
              } else {
                e.classList.add('muted');
                e.classList.add(`muted-${key}`);
              }
            });
          }

          return [key, value.length];
        }),
      );
      setCount(result);
    };

    if (document.readyState === 'complete') muteComment();
    window.addEventListener('load', muteComment);
    window.addEventListener(EVENT_COMMENT_REFRESH, muteComment);

    return () => {
      [
        ...document.querySelectorAll(
          muteIncludeReply ? COMMENT_WRAPPERS : COMMENT_ITEMS,
        ),
      ].forEach((comment) => {
        [...comment.classList].forEach((c) => {
          if (c.includes('filtered') || c.includes('muted')) {
            comment.classList.remove(c);
          }
        });
      });

      window.removeEventListener('load', muteComment);
      window.removeEventListener(EVENT_COMMENT_REFRESH, muteComment);
    };
  }, [controlTarget, filter, hideMutedMark, muteAllEmot, muteIncludeReply]);

  if (!countBarContainer) return null;
  return (
    <>
      {commentMuteStyles}
      <CountBar
        renderContainer={countBarContainer}
        controlTarget={controlTarget}
        count={count}
        hide={hideCountBar}
      />
    </>
  );
}

export default CommentMuter;
