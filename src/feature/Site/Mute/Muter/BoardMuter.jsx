import React, { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/styles';

import { BOARD, BOARD_IN_ARTICLE, BOARD_ITEMS } from 'core/selector';
import { EVENT_BOARD_REFRESH, useEvent } from 'hooks/Event';
import { useContent } from 'hooks/Content';
import { getUserInfo } from 'func/user';

import CountBar from './CountBar';
import { filterContent, trimEmotURL } from '../func';
import { emoticonFilterSelector } from '../selector';
import Info from '../FeatureInfo';

const style = {
  '@global': {
    '.body .article-list': {
      '& .frontend-header': {
        display: 'none',
      },
      '& .list-table.show-filtered-category .filtered-category': {
        display: 'flex !important',
      },
      '& .block-preview .vrow-preview': {
        display: 'none !important',
      },
      '& .filtered-emoticon': {
        display: 'none !important',
      },
    },
    '.hide-service-notice .notice-service': {
      display: 'none !important',
    },
    '.hide-no-permission .vrow[href$="#c_"]': {
      display: 'none !important',
    },
    '.hide-closed-deal .vrow.ar-closed': {
      display: 'none !important',
    },
  },
};

function BoardMuter() {
  const dispatch = useDispatch();
  const [addEventListener, removeEventListener] = useEvent();
  const { channel, board } = useContent();

  const {
    user,
    keyword,
    category,
    boardBarPos,
    hideCountBar,
    hideServiceNotice,
    hideNoPermission,
    hideClosedDeal,
  } = useSelector((state) => state[Info.ID].storage);
  const [controlTarget, setControlTarget] = useState(undefined);
  const [nameToIDMap, setNameToIDMap] = useState(undefined);
  const [countBarContainer, setCountBarContainer] = useState(undefined);
  const [count, setCount] = useState(undefined);
  const emoticionFilter = useSelector(emoticonFilterSelector);

  // 카테고리 매핑 테이블
  useLayoutEffect(() => {
    if (!board) return;

    const boardElement = document.querySelector(
      `${BOARD}, ${BOARD_IN_ARTICLE}`,
    );
    if (!boardElement) return;

    setControlTarget(boardElement);
    const name2id = Object.fromEntries(
      Object.entries(board.category).map(([key, value]) => [value, key]),
    );
    setNameToIDMap(name2id);

    const containerElement = document.createElement('div');
    setCountBarContainer(containerElement);
  }, [dispatch, board]);

  useLayoutEffect(() => {
    if (!controlTarget) return;

    controlTarget.insertAdjacentElement(boardBarPos, countBarContainer);
    controlTarget.style.marginBottom = boardBarPos === 'afterend' ? '0' : '';
  }, [controlTarget, countBarContainer, boardBarPos]);

  // 유저, 키워드, 카테고리 뮤트처리
  useLayoutEffect(() => {
    if (!controlTarget) return undefined;

    const muteArticle = () => {
      const articleList = [...controlTarget.querySelectorAll(BOARD_ITEMS)];
      const articleInfo = articleList
        .filter((a) => !a.href?.includes('#c_'))
        .map((a) => ({
          element: a,
          user: getUserInfo(a.querySelector('.user-info')),
          content: a.querySelector('.title')?.textContent || '',
          category: a.querySelector('.badge')?.textContent || '글머리없음',
        }));
      const channelCategory = category[channel.ID] || {};

      const result = filterContent({
        contents: articleInfo,
        userList: user,
        keywordList: keyword,
        categoryList: channelCategory,
        categoryMap: nameToIDMap,
      });
      setCount(result);
    };

    if (document.readyState === 'complete') muteArticle();
    window.addEventListener('load', muteArticle);
    addEventListener(EVENT_BOARD_REFRESH, muteArticle);

    return () => {
      window.removeEventListener('load', muteArticle);
      removeEventListener(EVENT_BOARD_REFRESH, muteArticle);
    };
  }, [
    controlTarget,
    nameToIDMap,
    keyword,
    user,
    channel,
    category,
    addEventListener,
    removeEventListener,
  ]);

  // 게시물 미리보기 뮤트
  useLayoutEffect(() => {
    if (!controlTarget) return;

    const images = controlTarget.querySelectorAll(
      '.vrow-preview noscript, .vrow-preview img',
    );
    images.forEach((e) => {
      const url = e.matches('img')
        ? trimEmotURL(e.src)
        : trimEmotURL(e.textContent.match(/(\/\/.+)type=list/g)[0]);

      if (emoticionFilter.url[url]) {
        e.parentNode.classList.add('filtered-emoticon');
      }
    });
  }, [controlTarget, emoticionFilter]);

  // 서비스 공지사항
  useLayoutEffect(() => {
    document.documentElement.classList.toggle(
      'hide-service-notice',
      hideServiceNotice,
    );
  }, [hideServiceNotice]);

  // (권한 없음) 게시물
  useLayoutEffect(() => {
    document.documentElement.classList.toggle(
      'hide-no-permission',
      hideNoPermission,
    );
  }, [hideNoPermission]);

  // [핫딜 채널] 식은딜 게시물
  useLayoutEffect(() => {
    if (!controlTarget) return;

    const articleList = [...controlTarget.querySelectorAll(BOARD_ITEMS)];
    articleList
      .filter((a) => a.querySelector('.deal-close'))
      .forEach((a) => a.classList.add('ar-closed'));
    document.documentElement.classList.toggle(
      'hide-closed-deal',
      hideClosedDeal,
    );
  }, [controlTarget, hideClosedDeal]);

  if (!countBarContainer) return null;
  return (
    <CountBar
      renderContainer={countBarContainer}
      controlTarget={controlTarget}
      count={count}
      hide={hideCountBar}
    />
  );
}

export default withStyles(style)(BoardMuter);
