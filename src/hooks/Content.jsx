import { useLayoutEffect } from 'react';

import {
  ARTICLE_LOADED,
  ARTICLE_TITLE,
  ARTICLE_URL,
  BOARD_LOADED,
  CHANNEL_TITLE_LOADED,
} from 'core/selector';
import { convertImgToAlt } from 'func/emoji';
import { getUserNick } from 'func/user';

import useLoadChecker from './useLoadChecker';

const pathToken = window.location.pathname.split('/');
pathToken.shift(); // ''
const pageType = pathToken.shift();
let channelID = pathToken.shift();
let channelName;
switch (pageType) {
  case 'b':
    // Nothing
    break;
  case 'e':
    channelID = 'emoticon';
    channelName = '아카콘';
    break;
  default:
    channelID = 'ArcaLive';
    channelName = '아카라이브';
    break;
}

const content = {
  channel: {
    ID: channelID,
    name: channelName,
  },
  board: undefined,
  article: undefined,
};

/**
 * 게시판 및 게시물 정보를 받아옵니다.
 * @returns {{
 *  channel: {
 *    ID: string,
 *    name: string,
 *  },
 *  board: {
 *    category: { id: label }
 *  }
 *  article: {
 *    ID: string,
 *    category: string,
 *    title: string,
 *    author: string,
 *    url: string
 *  }
 * }}
 */
export function useContent() {
  const titleLoaded = useLoadChecker(CHANNEL_TITLE_LOADED);
  const boardLoaded = useLoadChecker(BOARD_LOADED);
  const articleLoaded = useLoadChecker(ARTICLE_LOADED);

  useLayoutEffect(() => {
    if (!titleLoaded) return;
    if (content.channel.name) return;

    try {
      const { channelName: name } = document.querySelector(
        '.board-title .title',
      ).dataset;
      content.channel.name = name.replace(' 채널', '') || '';
    } catch (error) {
      console.warn('[ContentInfo] 채널 정보를 받아오지 못했습니다.');
    }
  }, [titleLoaded]);

  useLayoutEffect(() => {
    if (!boardLoaded) return;
    if (content.board) return;

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

      content.board = {
        category: Object.fromEntries(categoryEntries),
      };
    } catch (error) {
      console.warn('[ContentInfo] 카테고리 목록을 얻어오지 못했습니다.');
    }
  }, [boardLoaded]);

  useLayoutEffect(() => {
    if (!articleLoaded) return;
    if (content.article) return;

    const titleElement = document.querySelector(ARTICLE_TITLE);
    const category =
      titleElement?.querySelector('.badge')?.textContent || '일반';
    const title =
      convertImgToAlt([...(titleElement?.childNodes || [])].slice(2)) ||
      titleElement.textContent.trim() ||
      '제목 없음';
    const author =
      getUserNick(document.querySelector(`ARTICLE_AUTHOR`)) ||
      document.querySelector('.article-head .member-info').textContent.trim() ||
      '익명';
    const url =
      document.querySelector(ARTICLE_URL)?.href || window.location.href;
    const ID = url.match(/\/(?:(?:b\/[0-9a-z]+)|e)\/([0-9]+)/)[1] || 0;

    content.article = { ID, category, title, author, url };
  }, [articleLoaded]);

  return content;
}
