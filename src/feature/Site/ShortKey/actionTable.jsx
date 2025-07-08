import { getQuery, stringifyQuery } from 'func/http';

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
    action: 'prevCategory',
    label: '이전 카테고리',
    active: 'article|board',
    defaultKey: 'KeyC',
    callback() {
      const categoryUrlList = [
        ...document.querySelectorAll('.board-category .item a'),
      ].map((e) => e.href);
      const currentCategory = document.querySelector(
        '.board-category .item a.active',
      ).href;

      const targeIndex =
        (categoryUrlList.length +
          categoryUrlList.indexOf(currentCategory) -
          1) %
        categoryUrlList.length;
      window.location.href = categoryUrlList[targeIndex];
    },
  },
  {
    action: 'nextCategory',
    label: '다음 카테고리',
    active: 'article|board',
    defaultKey: 'KeyV',
    callback() {
      const categoryUrlList = [
        ...document.querySelectorAll('.board-category .item a'),
      ].map((e) => e.href);
      const currentCategory = document.querySelector(
        '.board-category .item a.active',
      ).href;

      const targeIndex =
        (categoryUrlList.indexOf(currentCategory) + 1) % categoryUrlList.length;
      window.location.href = categoryUrlList[targeIndex];
    },
  },
  {
    action: 'prevChannel',
    label: '이전 구독 채널',
    active: 'article|board',
    defaultKey: 'KeyZ',
    callback(_e, { content }) {
      const { subList } = unsafeWindow.LiveConfig;
      const currentIndex = subList.indexOf(content.channel.id);
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
      const currentIndex = subList.indexOf(content.channel.id);
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
        // 게시물 뷰
        const articleList = [
          ...document.querySelectorAll(
            '.article-view a.vrow:not(.notice):not(.filtered), .article-view div.vrow:not(.filtered) a.hybrid-title',
          ),
        ];

        // 조회중인 게시물 검색
        while (articleList.length > 0) {
          const article = articleList.pop();
          if (article.closest('.active')) {
            break;
          }
        }

        // 그 다음 게시물
        if (articleList.length > 0) {
          const article = articleList.pop();
          const url = article.href;
          window.location = url;
          return;
        }
      }
      const currentPage = document.querySelector(
        '.article-list~.pagination-wrapper .active',
      );
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
        // 게시물 뷰
        const articleList = [
          ...document.querySelectorAll(
            '.article-view a.vrow:not(.notice):not(.filtered), .article-view div.vrow:not(.filtered) a.hybrid-title',
          ),
        ].reverse();

        // 조회중인 게시물 검색
        while (articleList.length > 0) {
          const article = articleList.pop();
          if (article.closest('.active')) {
            break;
          }
        }

        // 그 다음 게시물
        if (articleList.length > 0) {
          const article = articleList.pop();
          const url = article.href || article.querySelector('a.title')?.href;
          window.location = url;
          return;
        }
      }
      const currentPage = document.querySelector(
        '.article-list~.pagination-wrapper .active',
      );
      currentPage.nextElementSibling?.querySelector('a').click();
    },
  },
  {
    action: 'goBoard',
    label: '게시물 목록으로 이동/첫 페이지로 이동',
    active: 'article|board',
    defaultKey: 'KeyQ',
    callback() {
      const { host } = window.location;
      const token = window.location.pathname.split('/');
      if (token.length < 4) {
        const query = getQuery();
        const keys = Object.keys(query);

        if (keys.length === 0) return;
        if (keys.length === 1 && query.mode === 'best') return;

        const pathname = token.slice(0, 3).join('/');
        const search = query.mode === 'best' ? '?mode=best' : '';
        window.location = `https://${host}${pathname}${search}`;
        return;
      }
      const pathname = token.slice(0, 3).join('/');
      const { mode, before, after, near, tz, p } = getQuery();
      const query = {};
      if (mode) query.mode = mode;
      if (before) query.before = before;
      if (after) query.after = after;
      if (near) query.near = near;
      if (tz) query.tz = tz;
      if (p && p !== '1') query.p = p;
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
      const query = getQuery();
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
    label: '댓글 목록/입력창으로 이동',
    active: 'article',
    defaultKey: 'KeyC',
    callback(e) {
      e.preventDefault();

      const comment = document.querySelector('#comment');
      const nav = document.querySelector('nav.navbar');
      const targetY = comment.offsetTop - nav.clientHeight;

      if (window.scrollY < comment.offsetTop - window.innerHeight) {
        window.scrollTo({ top: targetY });
      } else {
        document.querySelector('#comment textarea').focus();
      }
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
    defaultKey: 'KeyB',
    callback(_e, { content, setSnack }) {
      const token = window.location.pathname.split('/');
      const articleId = token.pop();
      fetch(
        `https://arca.live/api/scrap?slug=${content.channel.id}&articleId=${articleId}`,
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
