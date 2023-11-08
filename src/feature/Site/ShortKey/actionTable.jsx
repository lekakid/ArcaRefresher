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
    active: 'article|board',
    callback() {
      document.querySelector('.btn-arca-article-write')?.click();
    },
  },
  {
    action: 'refresh',
    active: 'article|board',
    callback() {
      window.location.reload();
    },
  },
  {
    action: 'moveTop',
    active: 'article|board',
    callback() {
      window.scrollTo(0, 0);
    },
  },
  {
    action: 'prev',
    active: 'article|board',
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
    active: 'article|board',
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
    active: 'article',
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
    active: 'board',
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
    active: 'article',
    callback() {
      document.querySelector('#comment textarea').focus();
    },
  },
  {
    action: 'recommend',
    active: 'article',
    callback() {
      document.querySelector('#rateUp').click();
    },
  },
  {
    action: 'scrap',
    active: 'article',
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
