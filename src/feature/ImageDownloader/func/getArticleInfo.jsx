import { ARTICLE_AUTHOR, ARTICLE_TITLE, ARTICLE_URL } from 'core/selector';
import convertImgToAlt from 'util/emoji';
import { getUserNick } from 'util/user';

export default function getArticleInfo() {
  const titleElement = document.querySelector(ARTICLE_TITLE);
  const articleCategory =
    titleElement.querySelector('.badge')?.textContent || '일반';
  const articleTitle =
    convertImgToAlt([...titleElement.childNodes].slice(2)) || '제목 없음';
  const articleAuthor =
    getUserNick(document.querySelector(ARTICLE_AUTHOR)) || '익명';
  const articleURL =
    document.querySelector(ARTICLE_URL)?.href || window.location.href;
  const articleID =
    articleURL.match(/\/(?:(?:b\/[0-9a-z]+)|e)\/([0-9]+)/)[1] || 0;

  return {
    articleCategory,
    articleTitle,
    articleAuthor,
    articleID,
    articleURL,
  };
}
