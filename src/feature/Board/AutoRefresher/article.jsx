import { BOARD_NOTICES, BOARD_ITEMS } from 'core/selector';
import toDocument from 'func/toDocument';

export async function getNewArticle() {
  try {
    const response = await fetch(window.location.href);
    if (!response.ok) throw new Error('[AutoRefresher] 연결 거부');

    const refreshedDocument = toDocument(await response.text());
    const notices = [...refreshedDocument.querySelectorAll(BOARD_NOTICES)];
    const articles = [...refreshedDocument.querySelectorAll(BOARD_ITEMS)];

    return { notices, articles };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function updateBoard(board, newArticles, animationClass) {
  // 공지사항 새로고침
  const noticeInsertPivot = board.querySelector('.head');
  [...board.querySelectorAll(BOARD_NOTICES)].forEach((o) => o.remove());
  newArticles.notices.reverse();
  newArticles.notices.forEach((n) => {
    noticeInsertPivot.insertAdjacentElement('afterend', n);
  });

  // 새 일반 게시물 확인 및 애니메이션 처리
  const oldPathnames = [...board.querySelectorAll(BOARD_ITEMS)].map(
    (o) => o.pathname || o.querySelector('a.title').pathname,
  );
  newArticles.articles.forEach((n) => {
    const pathname = n.pathname || n.querySelector('a.title').pathname;
    if (!oldPathnames.includes(pathname)) {
      n.classList.add(animationClass);
    }
  });

  // 일반 게시물 새로고침
  [...board.querySelectorAll(BOARD_ITEMS)].forEach((o) => o.remove());
  newArticles.articles.forEach((n) => {
    board.append(n);
  });

  // 미리보기 수정
  newArticles.articles.forEach((a) => {
    const lazyWrapper = a.querySelector('noscript');
    lazyWrapper?.replaceWith(lazyWrapper.firstElementChild);
  });

  unsafeWindow.applyLocalTimeFix();
}
