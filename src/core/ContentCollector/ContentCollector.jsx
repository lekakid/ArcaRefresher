import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  ARTICLE_AUTHOR,
  ARTICLE_INFO,
  ARTICLE_LOADED,
  ARTICLE_TITLE,
  ARTICLE_URL,
  BOARD_LOADED,
  CHANNEL_TITLE_LOADED,
  EMOTICON_AUTHOR,
  EMOTICON_INFO,
  EMOTICON_TITLE,
  NAVIGATION_LOADED,
} from 'constants/selector';
import { serializeText } from 'func/emoji';
import { ArcaUser } from 'func/user';

import { useLoadChecker } from 'core/LoadChecker';
import { setArticle, setCategory, setChannelName, setUser } from './slice';

function ContentCollector() {
  const dispatch = useDispatch();

  const navLoaded = useLoadChecker(NAVIGATION_LOADED);
  const titleLoaded = useLoadChecker(CHANNEL_TITLE_LOADED);
  const boardLoaded = useLoadChecker(BOARD_LOADED);
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);

  useLayoutEffect(() => {
    if (!navLoaded) return;

    try {
      const userElement = document.querySelector('nav .username > a');
      if (!userElement) {
        return;
      }
      const token = userElement.pathname.split('@')[1].split('/');
      let uniqueId = '';
      if (token.length > 1) {
        uniqueId = `#${token.pop()}`;
      }
      const nick = decodeURI(token.pop());
      dispatch(setUser({ id: `${nick}${uniqueId}` }));
    } catch (_) {
      console.warn('[ContentInfo] 이용자 정보를 받아오지 못했습니다.');
    }
  }, [dispatch, navLoaded]);

  useLayoutEffect(() => {
    if (!titleLoaded) return;

    try {
      const { channelName: name } = document.querySelector(
        '.board-title .title',
      ).dataset;
      dispatch(setChannelName(name.replace(' 채널', '') || ''));
    } catch (_) {
      console.warn('[ContentInfo] 채널 정보를 받아오지 못했습니다.');
    }
  }, [dispatch, titleLoaded]);

  useLayoutEffect(() => {
    if (!boardLoaded) return;

    try {
      const id2NameMapEntries = [
        ...document.querySelectorAll('.board-category a'),
      ].map((element) => {
        if (!element.href.includes('category='))
          return ['글머리없음', '글머리없음'];

        const id = decodeURI(element.href.split('category=')[1].split('&')[0]);
        const text = element.textContent;

        return [id, text];
      });

      if (id2NameMapEntries.length === 0) throw new Error();

      const name2IdMapEntries = id2NameMapEntries.map(([key, value]) => [
        value,
        key,
      ]);
      dispatch(
        setCategory({
          id2NameMap: Object.fromEntries(id2NameMapEntries),
          name2IdMap: Object.fromEntries(name2IdMapEntries),
        }),
      );
    } catch (_) {
      console.warn('[ContentInfo] 카테고리 목록을 얻어오지 못했습니다.');
    }
  }, [dispatch, boardLoaded]);

  useLayoutEffect(() => {
    if (!articleLoaded) return;

    try {
      const titleElement = document.querySelector(
        `${ARTICLE_TITLE}, ${EMOTICON_TITLE}`,
      );
      const infoElement = document.querySelector(
        `${ARTICLE_INFO}, ${EMOTICON_INFO}`,
      );
      const timeElement = infoElement?.querySelector('.date time');
      const user = new ArcaUser(
        document.querySelector(`${ARTICLE_AUTHOR}, ${EMOTICON_AUTHOR}`),
      );

      const category =
        titleElement?.querySelector('.badge')?.textContent || '일반';
      const title = serializeText(titleElement) || '제목 없음';
      const author = user.toString() || '익명';
      const datetime = new Date(
        timeElement?.getAttribute('datetime') || Date.now(),
      );
      const formatter = Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      });
      const datetimeString = formatter.format(datetime).replace(/:/g, '');
      const [date, time] = datetimeString.split(', ');
      const url =
        document.querySelector(ARTICLE_URL)?.href || window.location.href;
      const id = url.match(/\/(?:(?:b\/[0-9a-z]+)|e)\/([0-9]+)/)?.[1] ?? 0;

      dispatch(setArticle({ id, category, title, author, date, time, url }));
    } catch (_) {
      console.warn('[ContentInfo] 게시물 정보를 받아오지 못했습니다.');
    }
  }, [dispatch, articleLoaded]);

  return null;
}

export default ContentCollector;
