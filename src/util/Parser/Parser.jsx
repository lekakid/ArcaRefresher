import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useElementQuery } from 'core/hooks';
import {
  BOARD_LOADED,
  BOARD_CATEGORIES,
  CHANNEL_TITLE,
  ARTICLE_LOADED,
  ARTICLE_AUTHOR,
  ARTICLE_TITLE,
  ARTICLE_URL,
} from 'core/selector';
import { convertImgToAlt } from 'func/emoji';
import { getUserNick } from 'func/user';
import { setChannelInfo, setArticleInfo } from './slice';

export default function Parser() {
  const dispatch = useDispatch();
  const boardLoaded = useElementQuery(BOARD_LOADED);
  const articleLoaded = useElementQuery(ARTICLE_LOADED);

  useLayoutEffect(() => {
    if (!boardLoaded) return;

    const idRegex = /\/b\/([0-9a-zA-Z]{4,20})/;
    const { pathname } = window.location;
    const ID = pathname.match(idRegex)?.[1]?.toLowerCase() || null;

    const name = document.querySelector(CHANNEL_TITLE)?.textContent || null;

    const category = [...document.querySelectorAll(BOARD_CATEGORIES)].reduce(
      (acc, cur) => {
        if (cur.href.indexOf('category=') === -1)
          return { ...acc, 글머리없음: '글머리없음' };

        const id = decodeURI(cur.href.split('category=')[1].split('&')[0]);
        const text = cur.textContent;

        return { ...acc, [id]: text };
      },
      {},
    );
    dispatch(setChannelInfo({ ID, name, category }));
  }, [boardLoaded, dispatch]);

  useLayoutEffect(() => {
    if (!articleLoaded) return;

    const titleElement = document.querySelector(ARTICLE_TITLE);
    const category =
      titleElement.querySelector('.badge')?.textContent || '일반';
    const title =
      convertImgToAlt([...titleElement.childNodes].slice(2)) || '제목 없음';
    const author =
      getUserNick(document.querySelector(ARTICLE_AUTHOR)) || '익명';
    const url =
      document.querySelector(ARTICLE_URL)?.href || window.location.href;
    const ID = url.match(/\/(?:(?:b\/[0-9a-z]+)|e)\/([0-9]+)/)[1] || 0;

    dispatch(setArticleInfo({ ID, category, title, author, url }));
  }, [articleLoaded, dispatch]);

  return null;
}
