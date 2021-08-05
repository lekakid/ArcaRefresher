import { getChannelID, getChannelName, getUserNick } from '../$Common/Parser';
import {
  ARTICLE_AUTHOR,
  ARTICLE_CATEGORY,
  ARTICLE_TITLE,
  ARTICLE_URL,
} from '../$Common/Selector';

export function replaceFlag(
  string,
  {
    channelID,
    channelName,
    articleCategory,
    articleTitle,
    articleAuthor,
    articleURL,
    uploadName = '',
    index = 0,
  },
) {
  return string
    .replace('%channel%', channelName)
    .replace('%channelID%', channelID)
    .replace('%title%', articleTitle)
    .replace('%category%', articleCategory)
    .replace('%author%', articleAuthor)
    .replace('%url%', articleURL)
    .replace('%orig%', uploadName)
    .replace('%num%', `${index}`.padStart(3, '0'));
}

export function getArticleInfo() {
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
