import {
  getChannelID,
  getChannelName,
  getUserNick,
} from '../../$Common/Parser';
import {
  ARTICLE_AUTHOR,
  ARTICLE_CATEGORY,
  ARTICLE_TITLE,
  ARTICLE_URL,
} from '../../$Common/Selector';

export default function getArticleInfo() {
  const channelID = getChannelID();
  const channelName = getChannelName();
  const articleCategory =
    document.querySelector(ARTICLE_CATEGORY)?.textContent || '일반';
  const articleTitle =
    document.querySelector(ARTICLE_TITLE)?.lastChild.textContent.trim() ||
    '제목 없음';
  const articleAuthor =
    getUserNick(document.querySelector(ARTICLE_AUTHOR)) || '익명';
  const articleURL =
    document.querySelector(ARTICLE_URL)?.href || window.location.href;

  return {
    channelID,
    channelName,
    articleCategory,
    articleTitle,
    articleAuthor,
    articleURL,
  };
}
