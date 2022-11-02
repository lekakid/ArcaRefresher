import React, { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/styles';

import {
  COMMENT_INNER_VIEW,
  COMMENT_ITEMS,
  COMMENT_LOADED,
  COMMENT_WRAPPERS,
  COMMENT_EMOTICON,
} from 'core/selector';
import { useElementQuery } from 'core/hooks';
import { addAREvent, EVENT_COMMENT_REFRESH, removeAREvent } from 'core/event';
import { getUserInfo } from 'func/user';

import Info from '../FeatureInfo';
import { filterContent } from '../func';
import CountBar from './CountBar';
import useEmoticon from './useEmoticon';

const style = {
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
        '& .muted-emoticon': {
          '& .emoticon-wrapper': {
            width: 'auto !important',
            height: 'auto !important',
            textDecoration: 'none !important',
            '&::after': {
              content: '"[아카콘 뮤트됨]"',
            },
            '& > img, & > video': {
              display: 'none !important',
            },
          },
        },
        '& .hide-muted-emoticon': {
          display: 'none !important',
        },
      },
    },
  },
};

function CommentMuter() {
  const dispatch = useDispatch();
  const commentLoaded = useElementQuery(COMMENT_LOADED);
  const {
    storage: {
      user,
      keyword,
      emoticon,
      hideCountBar,
      hideMutedMark,
      muteIncludeReply,
    },
  } = useSelector((state) => state[Info.ID]);
  const [comment, setComment] = useState(undefined);
  const [container, setContainer] = useState(undefined);
  const [count, setCount] = useState(undefined);
  const emoticonFilter = useEmoticon(emoticon);

  useLayoutEffect(() => {
    if (!commentLoaded) return;

    const commentElement = document.querySelector(COMMENT_INNER_VIEW);
    if (!commentElement) return;

    setComment(commentElement);

    const countBarContainer = document.createElement('div');
    commentElement.insertAdjacentElement('beforebegin', countBarContainer);
    setContainer(countBarContainer);

    addAREvent(EVENT_COMMENT_REFRESH, () => {
      const refreshedComment = document.querySelector(COMMENT_INNER_VIEW);
      setComment(refreshedComment);
      refreshedComment.insertAdjacentElement('beforebegin', countBarContainer);
    });
  }, [dispatch, commentLoaded]);
  useLayoutEffect(() => {
    if (!commentLoaded) return undefined;

    const muteEmoticon = () => {
      const commentEmot = document.querySelectorAll(COMMENT_EMOTICON);
      commentEmot.forEach((c) => {
        const id = Number(c.dataset.id);
        c.closest(
          muteIncludeReply ? COMMENT_WRAPPERS : COMMENT_ITEMS,
        ).classList.toggle(
          hideMutedMark ? 'hide-muted-emoticon' : 'muted-emoticon',
          emoticonFilter.bundle?.indexOf(id) > -1,
        );
      });
    };

    addAREvent(EVENT_COMMENT_REFRESH, muteEmoticon);
    muteEmoticon();

    return () => {
      removeAREvent(EVENT_COMMENT_REFRESH, muteEmoticon);
    };
  }, [commentLoaded, emoticonFilter, hideMutedMark, muteIncludeReply]);

  useLayoutEffect(() => {
    if (!comment) return undefined;

    const muteComment = () => {
      const commentList = [
        ...document.querySelectorAll(
          muteIncludeReply ? COMMENT_WRAPPERS : COMMENT_ITEMS,
        ),
      ];
      const commentInfo = commentList.map((c) => ({
        element: c,
        user: getUserInfo(c.querySelector('.user-info')),
        content: c.querySelector('.message')?.textContent || '',
        category: '',
      }));

      const result = filterContent({
        contents: commentInfo,
        userList: user,
        keywordList: keyword,
      });
      setCount(result);
    };

    if (document.readyState === 'complete') muteComment();
    window.addEventListener('load', muteComment);
    addAREvent(EVENT_COMMENT_REFRESH, muteComment);

    return () => {
      window.removeEventListener('load', muteComment);
      removeAREvent(EVENT_COMMENT_REFRESH, muteComment);
    };
  }, [comment, keyword, user, muteIncludeReply]);

  if (!container) return null;
  return (
    <CountBar
      renderContainer={container}
      classContainer={comment}
      count={count}
      hide={hideCountBar}
    />
  );
}

export default withStyles(style)(CommentMuter);
