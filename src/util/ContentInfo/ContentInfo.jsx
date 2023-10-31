import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  BOARD_LOADED,
  ARTICLE_LOADED,
  ARTICLE_AUTHOR,
  ARTICLE_TITLE,
  ARTICLE_URL,
  CHANNEL_TITLE_LOADED,
} from 'core/selector';
import { useLoadChecker } from 'hooks';
import { convertImgToAlt } from 'func/emoji';
import { getUserNick } from 'func/user';

import { setChannelInfo, setArticleInfo } from './slice';

export default function ContentInfo() {
  const dispatch = useDispatch();
  const titleLoaded = useLoadChecker(CHANNEL_TITLE_LOADED);
  const boardLoaded = useLoadChecker(BOARD_LOADED);
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);

  useLayoutEffect(() => {
    if (!titleLoaded) return;

    try {
      const { channelName } = document.querySelector(
        '.board-title .title',
      ).dataset;
      dispatch(setChannelInfo({ name: channelName }));
    } catch (error) {
      console.warn('[ContentInfo] 채널 이름을 받아오지 못했습니다.');
    }
  }, [dispatch, titleLoaded]);

  useLayoutEffect(() => {
    if (!boardLoaded) return;

    try {
      const categoryEntries = [
        ...document.querySelectorAll('.board-category a'),
      ].map((element) => {
        if (!element.href.includes('category='))
          return ['글머리없음', '글머리없음'];

        const id = decodeURI(element.href.split('category=')[1].split('&')[0]);
        const text = element.textContent;

        return [id, text];
      });

      if (categoryEntries.length === 0) throw new Error();

      dispatch(
        setChannelInfo({ category: Object.fromEntries(categoryEntries) }),
      );
    } catch (error) {
      console.warn('[ContentInfo] 카테고리 목록을 얻어오지 못했습니다.');
    }
  }, [boardLoaded, dispatch]);

  useLayoutEffect(() => {
    if (!articleLoaded) return;

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

  return null;
}
