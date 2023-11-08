function parseQuery(query) {
  return Object.fromEntries(
    query
      .substring(1)
      .split('&')
      .filter((e) => e)
      .map((e) => e.split('=')),
  );
}

function stringifyQuery(query) {
  let search = `?${Object.entries(query)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')}`;
  if (search === '?') search = '';

  return search;
}

export default [
  {
    action: 'write',
    label: '글 작성',
    active: 'article|board',
    defaultKey: 'KeyW',
    callback() {
      document.querySelector('.btn-arca-article-write')?.click();
    },
  },
  {
    action: 'refresh',
    label: '새로고침',
    active: 'article|board',
    defaultKey: 'KeyR',
    callback() {
      window.location.reload();
    },
  },
  {
    action: 'moveTop',
    label: '가장 위로 스크롤',
    active: 'article|board',
    defaultKey: 'KeyT',
    callback() {
      window.scrollTo(0, 0);
    },
  },
  {
    action: 'prevChannel',
    label: '이전 구독 채널',
    active: 'article|board',
    defaultKey: 'KeyZ',
    callback(_e, { content }) {
      const { subList } = unsafeWindow.LiveConfig;
      const currentIndex = subList.indexOf(content.channel.ID);
      if (currentIndex < 0) return;

      const prevIndex = (subList.length + currentIndex - 1) % subList.length;
      window.location.href = `https://arca.live/b/${subList[prevIndex]}`;
    },
  },
  {
    action: 'nextChannel',
    label: '다음 구독 채널',
    active: 'article|board',
    defaultKey: 'KeyX',
    callback(_e, { content }) {
      const { subList } = unsafeWindow.LiveConfig;
      const currentIndex = subList.indexOf(content.channel.ID);
      if (currentIndex < 0) return;

      const nextIndex = (currentIndex + 1) % subList.length;
      window.location.href = `https://arca.live/b/${subList[nextIndex]}`;
    },
  },
  {
    action: 'prev',
    label: '이전 글/게시판 이전 페이지',
    active: 'article|board',
    defaultKey: 'KeyA',
    callback() {
      const token = window.location.pathname.split('/');
      if (token.length > 3) {
        // 게시물
        const currentArticle = document.querySelector(
          '.article-view a.vrow.active',
        );
        if (
          currentArticle.previousElementSibling &&
          !currentArticle.previousElementSibling.matches('.notice')
        ) {
          const url = currentArticle.previousElementSibling.href;
          window.location = url;
          return;
        }
      }
      const currentPage = document.querySelector('.pagination-wrapper .active');
      currentPage.previousElementSibling?.querySelector('a').click();
    },
  },
  {
    action: 'next',
    label: '다음 글/게시판 다음 페이지',
    active: 'article|board',
    defaultKey: 'KeyS',
    callback() {
      const token = window.location.pathname.split('/');
      if (token.length > 3) {
        // 게시물
        const currentArticle = document.querySelector(
          '.article-view a.vrow.active',
        );
        if (currentArticle.nextElementSibling) {
          const url = currentArticle.nextElementSibling.href;
          window.location = url;
          return;
        }
      }
      const currentPage = document.querySelector('.pagination-wrapper .active');
      currentPage.nextElementSibling?.querySelector('a').click();
    },
  },
  {
    action: 'goBoard',
    label: '게시물 목록으로 이동',
    active: 'article',
    defaultKey: 'KeyQ',
    callback() {
      const { host } = window.location;
      const token = window.location.pathname.split('/');
      const pathname = token.slice(0, 3).join('/');
      const { mode, before, after, near, tz, p } = parseQuery(
        window.location.search,
      );
      const query = {};
      if (mode) query.mode = mode;
      if (before) query.before = before;
      if (after) query.after = after;
      if (near) query.near = near;
      if (tz) query.tz = tz;
      if (p) query.p = p;
      const search = stringifyQuery(query);
      window.location = `https://${host}${pathname}${search}`;
    },
  },
  {
    action: 'goBest',
    label: '개념글 페이지 토글',
    active: 'board',
    defaultKey: 'KeyE',
    callback() {
      const { host } = window.location;
      const token = window.location.pathname.split('/');
      const pathname = token.slice(0, 3).join('/');
      const query = parseQuery(window.location.search);
      if (query.mode === 'best') {
        window.location = `https://${host}${pathname}`;
        return;
      }
      const search = stringifyQuery({ mode: 'best' });
      window.location = `https://${host}${pathname}${search}`;
    },
  },
  {
    action: 'comment',
    label: '댓글 입력창으로 이동',
    active: 'article',
    defaultKey: 'KeyC',
    callback(e) {
      document.querySelector('#comment textarea').focus();
      e.preventDefault();
    },
  },
  {
    action: 'recommend',
    label: '게시물 추천',
    active: 'article',
    defaultKey: 'KeyF',
    callback() {
      document.querySelector('#rateUp').click();
    },
  },
  {
    action: 'scrap',
    label: '게시물 스크랩',
    active: 'article',
    defaultKey: 'KeyV',
    callback(_e, { content, setSnack }) {
      const token = window.location.pathname.split('/');
      const articleId = token.pop();
      fetch(
        `https://arca.live/api/scrap?slug=${content.channel.ID}&articleId=${articleId}`,
      )
        .then((r) => r.json())
        .then((json) => {
          if (!json.result) {
            setSnack({ msg: '스크랩 실패 (서버 오류?)', time: 3000 });
            return;
          }

          setSnack({
            msg: `스크랩 ${json.isScrap ? '되었습니다' : '취소되었습니다'}.`,
            time: 3000,
          });

          document.querySelector('#scrapForm .result').textContent =
            json.isScrap ? '스크랩 됨' : '스크랩';
        });
    },
  },
];
