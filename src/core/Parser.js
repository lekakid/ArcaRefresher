export const CurrentPage = {
  Channel: {
    ID: '',
    Name: '',
  },
  Article: {
    Title: '',
    Category: '',
    Author: '',
    AuthorID: '',
    URL: '',
  },
  Category: [],
  Component: {
    Article: false,
    Comment: false,
    Board: false,
    Write: false,
  },
};

export default function initialize() {
  const articleElement = document.querySelector('article');
  const boardTitle = articleElement.querySelector('.board-title');
  const articleView = articleElement.querySelector('.article-wrapper');
  const commentView = articleElement.querySelector('#comment');
  const boardView = articleElement.querySelector(
    'div.board-article-list, div.included-article-list'
  );
  const writeView = articleElement.querySelector('.article-write');

  if (boardTitle) {
    CurrentPage.Channel = {
      ID: window.location.pathname.split('/')[2],
      Name: boardTitle.querySelector('a:not([class])').textContent,
    };
  }

  if (articleView) {
    const titleElement = articleView.querySelector('.article-head .title');
    const categoryElement = articleView.querySelector('.article-head .badge');
    const authorElement = articleView.querySelector('.article-head .user-info');
    const linkElement = articleView.querySelector('.article-body .article-link a');

    CurrentPage.Article = {
      Title: titleElement.lastChild.textContent.trim(),
      Category: categoryElement ? categoryElement.textContent : '',
      Author: authorElement ? parseUserInfo(authorElement) : '',
      AuthorID: authorElement ? parseUserID(authorElement) : '',
      URL: linkElement ? linkElement.href : window.location.href,
    };
  }

  if (boardView) {
    const categoryElements = boardView.querySelectorAll('.board-category a');
    const categoryArray = Array.prototype.slice.call(categoryElements);
    CurrentPage.Category = categoryArray.map((e) => e.textContent);
  }

  CurrentPage.Component = {
    Article: !!articleView,
    Comment: !!commentView,
    Board: !!boardView,
    Write: !!writeView,
  };
}

export function parseUserInfo(infoElement) {
  if (!infoElement) {
    console.error('[Parser.parseUserInfo] 올바르지 않은 부모 엘리먼트 사용');
    return null;
  }

  if (infoElement.dataset.info) {
    return infoElement.dataset.info;
  }

  let id = infoElement.children[0].title || infoElement.children[0].textContent;
  if (/\([0-9]*\.[0-9]*\)/.test(id)) {
    id = infoElement.childNodes[0].textContent + id;
  }

  infoElement.dataset.info = id;
  return id;
}

export function parseUserID(infoElement) {
  if (!infoElement) {
    console.error('[Parser.parseUserID] 올바르지 않은 부모 엘리먼트 사용');
    return null;
  }

  if (infoElement.dataset.id) {
    return infoElement.dataset.id;
  }

  let id = infoElement.children[0].title || infoElement.children[0].textContent;
  if (id.indexOf('#') > -1) {
    id = id.substring(id.indexOf('#'));
  }

  infoElement.dataset.id = id;
  return id;
}
