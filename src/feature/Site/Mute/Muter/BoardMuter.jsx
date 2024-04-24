import { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalStyles } from '@mui/material';

import { BOARD, BOARD_IN_ARTICLE, BOARD_ITEMS } from 'core/selector';
import { EVENT_BOARD_REFRESH } from 'core/event';
import { useContent } from 'hooks/Content';
import { ArcaUser } from 'func/user';

import CountBar from './CountBar';
import { filterContent, trimEmotURL } from '../func';
import { filterSelector } from '../selector';
import Info from '../FeatureInfo';

const globalChannel = ['live', 'headline', 'replay', 'breaking'];

const boardMuteStyles = (
  <GlobalStyles
    styles={{
      '.body .article-list': {
        '& .frontend-header': {
          display: 'none !important',
        },
        '& .list-table.show-filtered-category .filtered-category': {
          display: 'flex !important',
        },
        '& .list-table.show-filtered-channel .filtered-channel': {
          display: 'flex !important',
        },
        '& .filtered-preview .vrow-preview': {
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
    }}
  />
);

function BoardMuter() {
  const dispatch = useDispatch();
  const { channel, category } = useContent();

  const filter = useSelector((state) => filterSelector(state, channel.id));
  const {
    boardBarPos,
    hideCountBar,
    hideServiceNotice,
    hideNoPermission,
    hideClosedDeal,
  } = useSelector((state) => state[Info.id].storage);

  const [controlTarget, setControlTarget] = useState(undefined);
  const [countBarContainer, setCountBarContainer] = useState(undefined);
  const [count, setCount] = useState(undefined);

  // 컨테이너 생성
  useLayoutEffect(() => {
    if (!category) return;

    const boardElement = document.querySelector(
      `${BOARD}, ${BOARD_IN_ARTICLE}`,
    );
    if (!boardElement) return;
    setControlTarget(boardElement);

    const containerElement = document.createElement('div');
    setCountBarContainer(containerElement);
  }, [dispatch, category]);

  useLayoutEffect(() => {
    if (!controlTarget) return;

    controlTarget.insertAdjacentElement(boardBarPos, countBarContainer);
    controlTarget.style.marginBottom = boardBarPos === 'afterend' ? '0' : '';
  }, [controlTarget, countBarContainer, boardBarPos]);

  // 유저, 키워드, 카테고리, 채널 뮤트처리
  useLayoutEffect(() => {
    if (!controlTarget) return undefined;

    const isGlogal = globalChannel.includes(channel.id);

    const muteArticle = () => {
      const articles = [...controlTarget.querySelectorAll(BOARD_ITEMS)];
      const articleInfos = articles
        .filter((article) => !article.href?.includes('#c_'))
        .map((article) => {
          [...article.classList].forEach((c) => {
            if (c.includes('filtered')) {
              article.classList.toggle(c, false);
            }
          });
          return {
            element: article,
            user: new ArcaUser(article.querySelector('.user-info')).toUID(),
            content: article.querySelector('.title')?.textContent || '',
            channel: isGlogal
              ? article.querySelector('.badge')?.textContent
              : undefined,
            category: !isGlogal
              ? category.name2IdMap[
                  article.querySelector('.badge')?.textContent
                ] || '글머리없음'
              : undefined,
          };
        });

      const filteredList = filterContent(articleInfos, filter);
      const result = Object.fromEntries(
        Object.entries(filteredList)
          .map(([key, value]) => {
            if (key !== 'all') {
              value.forEach((e) => {
                if (key !== 'preview') e.classList.add('filtered');
                e.classList.add(`filtered-${key}`);
              });
            }

            return [key, value.length];
          })
          .filter((a) => a),
      );
      setCount(result);
    };

    if (document.readyState === 'complete') muteArticle();
    window.addEventListener('load', muteArticle);
    window.addEventListener(EVENT_BOARD_REFRESH, muteArticle);

    return () => {
      window.removeEventListener('load', muteArticle);
      window.removeEventListener(EVENT_BOARD_REFRESH, muteArticle);
    };
  }, [channel, category, filter, controlTarget]);

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

      if (filter.emoticon.url[url]) {
        e.parentNode.classList.add('filtered-emoticon');
      }
    });
  }, [controlTarget, filter.emoticon]);

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
    <>
      {boardMuteStyles}
      <CountBar
        renderContainer={countBarContainer}
        controlTarget={controlTarget}
        count={count}
        hide={hideCountBar}
      />
    </>
  );
}

export default BoardMuter;
