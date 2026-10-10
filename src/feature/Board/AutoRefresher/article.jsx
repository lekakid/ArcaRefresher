import { unsafeWindow } from '$';
import { BOARD_NOTICES, BOARD_ITEMS } from 'core/selector';
import { getDocument } from 'func/http';

export async function getNewArticle() {
  try {
    const response = await fetch(window.location.href);
    if (!response.ok) throw new Error('[AutoRefresher] 연결 거부');

    const refreshedDocument = getDocument(await response.text());
    const notices = [...refreshedDocument.querySelectorAll(BOARD_NOTICES)];
    const articles = [...refreshedDocument.querySelectorAll(BOARD_ITEMS)];

    return { notices, articles };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function updateBoard(board, newArticles, animationClass) {
  const tableHead = board.querySelector('.head');
  const noticeUnfoldBtn = board.querySelector('.notice-unfilter');

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

  // 게시물 이미지 미리보기 lazy load 해제
  newArticles.articles.forEach((a) => {
    const lazyWrapper = a.querySelector('noscript');
    lazyWrapper?.replaceWith(lazyWrapper.firstElementChild);
  });

  // 리스트 재구성 후 새로고침
  const updatedChildList = [
    tableHead,
    ...newArticles.notices,
    ...(noticeUnfoldBtn ? [noticeUnfoldBtn] : []),
    ...newArticles.articles,
  ];
  board.replaceChildren(...updatedChildList);

  unsafeWindow.applyLocalTimeFix();
}
