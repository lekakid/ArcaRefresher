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

  const dataElement = infoElement.querySelector('[data-filter]');
  const data = dataElement.dataset.filter;
  const id = data.match(/#[0-9]{8}|[0-9]{1,3}\.[0-9]{1,3}|[^0-9]+$/g)[0];

  let info;
  if (data.indexOf('#') > -1) {
    info = `${dataElement.textContent}${id}`;
  }
  if (data.indexOf(',') > -1) {
    info = `${dataElement.textContent}(${id})`;
  } else {
    info = id;
  }

  infoElement.dataset.info = info;
  return info;
}

export function parseUserID(infoElement) {
  if (!infoElement) {
    console.error('[Parser.parseUserID] 올바르지 않은 부모 엘리먼트 사용');
    return null;
  }

  if (infoElement.dataset.id) {
    return infoElement.dataset.id;
  }

  const data = infoElement.querySelector('[data-filter]').dataset.filter;
  let id = data.match(/#[0-9]{8}|[0-9]{1,3}\.[0-9]{1,3}|[^0-9]+$/g)[0];

  if (data.indexOf(',') > -1) {
    id = `(${id})`;
  }

  infoElement.dataset.id = id;
  return id;
}
