import { getDateStr, in24 } from '../$Common/DateHandler';
import {
  BOARD_ARTICLES,
  BOARD_ARTICLES_WITHOUT_NOTICE,
  BOARD_VIEW_WITHOUT_ARTICLE,
  USER_INFO,
} from '../$Common/Selector';

export async function getNewArticle() {
  try {
    const newArticles = await new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      req.open('GET', window.location.href);
      req.responseType = 'document';
      req.timeout = 2000;
      req.onload = () => {
        const { response } = req;
        const articles = response
          .querySelector(BOARD_VIEW_WITHOUT_ARTICLE)
          .querySelectorAll(BOARD_ARTICLES);
        resolve(articles);
      };
      req.ontimeout = () => {
        reject(new Error('[AutoRefresher] 연결 시간 초과'));
      };
      req.onerror = () => {
        reject(new Error('[AutoRefresher] 연결 거부'));
      };
      req.send();
    });
    return [...newArticles];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function swapArticle(
  articleContainer,
  refreshedArticles,
  animationClass,
) {
  const insertedArticles = [
    ...articleContainer.querySelectorAll(BOARD_ARTICLES),
  ];

  // Filtering new articles, swap exist articles to new thing
  const newArticles = refreshedArticles.filter((a) => {
    const exist = insertedArticles.some((o) => {
      if (o.pathname === a.pathname) {
        const userInfoOnOld = o.querySelector(USER_INFO);
        a.querySelector(USER_INFO).replaceWith(userInfoOnOld);
        o.replaceWith(a);
        return true;
      }
      return false;
    });

    return !exist;
  });

  // Insert new articles
  const insertPos = articleContainer.querySelector(
    BOARD_ARTICLES_WITHOUT_NOTICE,
  );
  newArticles.forEach((a) => {
    a.classList.add(animationClass);
    articleContainer.insertBefore(a, insertPos);
  });

  // calibrate preview image, time zone
  const calibrateArticles = [
    ...articleContainer.querySelectorAll(BOARD_ARTICLES),
  ];
  calibrateArticles.forEach((a) => {
    const lazyWrapper = a.querySelector('noscript');
    if (lazyWrapper) lazyWrapper.replaceWith(lazyWrapper.firstChild);

    const time = a.querySelector('time');
    if (time) {
      time.textContent = getDateStr(
        time.dateTime,
        in24(time.dateTime) ? 'hh:mm' : 'year.month.day',
      );
    }
  });
}
