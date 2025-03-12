import { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalStyles } from '@mui/material';

import {
  COMMENT_INNER,
  COMMENT_ITEMS,
  COMMENT_WRAPPERS,
  COMMENT_EMOTICON,
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
          '& .comment-item.muted-keyword': {
            '& .text pre': {
              color: 'var(--color-text-muted) !important',
            },
            color: 'var(--color-text-muted) !important',
          },
          '&:not(.show-filtered):not(.show-filtered-keyword) .comment-item.muted-keyword':
            {
              '& .text pre': {
                display: 'none',
              },
              '& .text:after': {
                content: '"[키워드 뮤트됨]"',
              },
            },
          '& .comment-item.muted-user': {
            '& .text pre': {
              color: 'var(--color-text-muted) !important',
            },
            color: 'var(--color-text-muted) !important',
          },
          '&:not(.show-filtered):not(.show-filtered-user) .comment-item.muted-user':
            {
              '& .text pre': {
                display: 'none',
              },
              '& .text:after': {
                content: '"[이용자 뮤트됨]"',
              },
              '& .emoticon-wrapper': {
                '& .emoticon': {
                  display: 'none',
                },
                '&:after': {
                  content: '"[이용자 뮤트됨]"',
                },
                height: 0,
              },
            },
          '& .emoticon-muted': {
            '& .emoticon-wrapper, & .combo_emoticon-wrapper': {
              width: 'auto !important',
              height: 'auto !important',
              textDecoration: 'none !important',
              '& > img, & > video': {
                display: 'none !important',
              },
            },
          },
          '& .hide-emoticon-muted': {
            display: 'none !important',
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

  // 이모티콘 뮤트
  useLayoutEffect(() => {
    if (!commentLoaded) return undefined;

    const muteEmoticon = () => {
      const commentEmot = document.querySelectorAll(COMMENT_EMOTICON);
      commentEmot.forEach((c) => {
        const id = Number(c.dataset.id);
        if (muteAllEmot || !!filter.emoticon.bundle[id]) {
          c.closest(
            muteIncludeReply ? COMMENT_WRAPPERS : COMMENT_ITEMS,
          ).classList.add(
            hideMutedMark ? 'hide-emoticon-muted' : 'emoticon-muted',
          );
        }

        if (!(muteAllEmot || filter.emoticon.bundle[id]) || hideMutedMark)
          return;
        const muted = document.createElement('span');
        muted.append('[아카콘 뮤트됨]');
        muted.classList.add('muted');
        muted.title = muteAllEmot ? '알 수 없음' : filter.emoticon.bundle[id];
        c.closest('.emoticon-wrapper, .combo_emoticon-wrapper').append(muted);
      });
    };

    muteEmoticon();
    window.addEventListener(EVENT_COMMENT_REFRESH, muteEmoticon);

    return () => {
      const commentEmot = document.querySelectorAll(COMMENT_EMOTICON);
      commentEmot.forEach((c) => {
        c.closest(
          muteIncludeReply ? COMMENT_WRAPPERS : COMMENT_ITEMS,
        ).classList.remove(
          hideMutedMark ? 'hide-emoticon-muted' : 'emoticon-muted',
        );
        c.closest('.emoticon-wrapper, .combo_emoticon-wrapper')
          .querySelector('span')
          ?.remove();
      });
      window.removeEventListener(EVENT_COMMENT_REFRESH, muteEmoticon);
    };
  }, [
    commentLoaded,
    filter.emoticon,
    hideMutedMark,
    muteIncludeReply,
    muteAllEmot,
  ]);

  // 키워드, 이용자 뮤트
  useLayoutEffect(() => {
    if (!controlTarget) return undefined;

    const muteComment = () => {
      const comments = [
        ...document.querySelectorAll(
          muteIncludeReply ? COMMENT_WRAPPERS : COMMENT_ITEMS,
        ),
      ];
      const commentInfos = comments.map((comment) => ({
        element: comment,
        user: new ArcaUser(comment.querySelector('.user-info')).toUID(),
        content: serializeText(comment.querySelector('.message pre')) || '',
        deleted: muteIncludeReply
          ? comment.querySelector('.comment-item').classList.contains('deleted')
          : comment.classList.contains('deleted'),
      }));

      const filteredList = filterContent(commentInfos, filter);
      const result = Object.fromEntries(
        Object.entries(filteredList).map(([key, value]) => {
          if (key !== 'all') {
            value.forEach((e) => {
              if (
                key === 'deleted' ||
                hideMutedMark ||
                e.matches('.comment-wrapper')
              ) {
                e.classList.add('filtered');
                e.classList.add(`filtered-${key}`);
              } else {
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
  }, [controlTarget, filter, hideMutedMark, muteIncludeReply]);

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
