import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useElementQuery } from 'core/hooks';
import {
  BOARD_LOADED,
  ARTICLE_LOADED,
  ARTICLE_AUTHOR,
  ARTICLE_TITLE,
  ARTICLE_URL,
  CHANNEL_TITLE_LOADED,
  COMMENT_LOADED,
  WRITE_LOADED,
} from 'core/selector';
import { convertImgToAlt } from 'func/emoji';
import { getUserNick } from 'func/user';
import { setChannelInfo, setArticleInfo, setLoadInfo } from './slice';

export default function Parser() {
  const dispatch = useDispatch();
  const titleLoaded = useElementQuery(CHANNEL_TITLE_LOADED);
  const boardLoaded = useElementQuery(BOARD_LOADED);
  const articleLoaded = useElementQuery(ARTICLE_LOADED);
  const commentLoaded = useElementQuery(COMMENT_LOADED);
  const writeLoaded = useElementQuery(WRITE_LOADED);

  useLayoutEffect(() => {
    const idRegex = /\/b\/([0-9a-zA-Z]{4,20})/;
    const { pathname } = window.location;
    const ID = pathname.match(idRegex)?.[1]?.toLowerCase() || null;

    dispatch(setChannelInfo({ ID }));
  }, [dispatch]);

  useLayoutEffect(() => {
    if (!titleLoaded) return;

    const name =
      document.querySelector('.board-title .title')?.dataset.channelName ||
      null;
    dispatch(setChannelInfo({ name }));
  }, [dispatch, titleLoaded]);

  useLayoutEffect(() => {
    if (!boardLoaded) return;

    dispatch(setLoadInfo({ board: true }));

    const category = [...document.querySelectorAll('.board-category a')].reduce(
      (acc, cur) => {
        if (cur.href.indexOf('category=') === -1)
          return { ...acc, 글머리없음: '글머리없음' };

        const id = decodeURI(cur.href.split('category=')[1].split('&')[0]);
        const text = cur.textContent;

        return { ...acc, [id]: text };
      },
      {},
    );

    dispatch(setChannelInfo({ category }));
  }, [boardLoaded, dispatch]);

  useLayoutEffect(() => {
    if (!articleLoaded) return;

    dispatch(setLoadInfo({ article: true }));

    const titleElement = document.querySelector(ARTICLE_TITLE);
    const category =
      titleElement?.querySelector('.badge')?.textContent || '일반';
    const title =
      convertImgToAlt([...(titleElement?.childNodes || [])].slice(2)) ||
      '제목 없음';
    const author =
      getUserNick(document.querySelector(ARTICLE_AUTHOR)) || '익명';
    const url =
      document.querySelector(ARTICLE_URL)?.href || window.location.href;
    const ID = url.match(/\/(?:(?:b\/[0-9a-z]+)|e)\/([0-9]+)/)[1] || 0;

    dispatch(setArticleInfo({ ID, category, title, author, url }));
  }, [articleLoaded, dispatch]);

  useLayoutEffect(() => {
    if (!commentLoaded) return;

    dispatch(setLoadInfo({ comment: true }));
  }, [commentLoaded, dispatch]);

  useLayoutEffect(() => {
    if (!writeLoaded) return;

    dispatch(setLoadInfo({ write: true }));
  }, [writeLoaded, dispatch]);

  return null;
}
