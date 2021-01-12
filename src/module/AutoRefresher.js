import Configure from '../core/Configure';
import Parser from '../core/Parser';
import { getTimeStr, in24 } from '../util/DateManager';

import refreshersheet from '../css/AutoRefresher.css';

export default { load, addRefreshCallback };

const REFRESH_TIME = { key: 'refreshTime', defaultValue: 3 };
const HIDE_REFRESHER = { key: 'hideRefresher', defaultValue: false };

let refreshTime = 0;
let loader = null;
let loopInterval = null;

const refreshCallbackList = [];

function load() {
  try {
    addSetting();

    if (Parser.hasArticle()) return;
    if (Parser.hasBoard()) {
      apply();
    }
  } catch (error) {
    console.error(error);
  }
}

function addSetting() {
  const refreshTimeSelect = (
    <select>
      <option value="0">사용 안 함</option>
      <option value="3">3초</option>
      <option value="5">5초</option>
      <option value="10">10초</option>
    </select>
  );
  Configure.addSetting({
    category: Configure.categoryKey.UTILITY,
    header: '자동 새로고침',
    view: refreshTimeSelect,
    description: '일정 시간마다 게시물 목록을 갱신합니다.',
    valueCallback: {
      save() {
        Configure.set(REFRESH_TIME, Number(refreshTimeSelect.value));
      },
      load() {
        refreshTimeSelect.value = Configure.get(REFRESH_TIME);
      },
    },
  });

  const hideRefreshSign = (
    <select>
      <option value="false">보임</option>
      <option value="true">숨김</option>
    </select>
  );
  Configure.addSetting({
    category: Configure.categoryKey.UTILITY,
    header: '새로고침 애니메이션 숨김',
    view: hideRefreshSign,
    description: '',
    valueCallback: {
      save() {
        Configure.set(HIDE_REFRESHER, hideRefreshSign.value === 'true');
      },
      load() {
        hideRefreshSign.value = Configure.get(HIDE_REFRESHER);
      },
    },
  });
}

function addRefreshCallback(callback) {
  refreshCallbackList.push(callback);
  refreshCallbackList.sort((a, b) => a.priority - b.priority);
}

function apply() {
  refreshTime = Configure.get(REFRESH_TIME);
  if (refreshTime === 0) return;

  const articleList = Parser.queryView('board');

  loader = (
    <div id="autoRefresher" className={Configure.get(HIDE_REFRESHER) ? 'hidden' : ''}>
      <style>{refreshersheet}</style>
    </div>
  );
  articleList.append(loader);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (loopInterval == null) start();
  });
  articleList.addEventListener('click', (event) => {
    if (event.target.tagName !== 'INPUT') return;

    if (event.target.classList.contains('batch-check-all')) {
      if (event.target.checked) stop();
      else start();
    } else {
      const btns = articleList.querySelectorAll('.batch-check');
      for (const btn of btns) {
        if (btn.checked) {
          stop();
          return;
        }
      }

      start();
    }
  });

  start();
}

function swapNewArticle(newArticles) {
  const oldArticles = Parser.queryItems('articles', 'board');

  const oldnums = [];
  for (const o of oldArticles) {
    oldnums.push(o.pathname.split('/')[3]);
    o.remove();
  }

  for (const n of newArticles) {
    if (oldnums.indexOf(n.pathname.split('/')[3]) === -1) {
      n.setAttribute('style', 'animation: light 0.5s');
    }

    const lazywrapper = n.querySelector('noscript');
    if (lazywrapper) lazywrapper.outerHTML = lazywrapper.innerHTML;

    const time = n.querySelector('time');
    if (time && in24(time.dateTime)) {
      time.innerText = getTimeStr(time.dateTime);
    }
  }

  const articleList = Parser.queryView('board');
  articleList.append(...newArticles);
  const noticeUnfilterBtn = articleList.querySelector('.notice-unfilter');
  if (noticeUnfilterBtn) {
    const firstArticle = articleList.querySelector('a.vrow:not(.notice)');
    firstArticle.insertAdjacentElement('beforebegin', noticeUnfilterBtn);
  }

  for (const { callback } of refreshCallbackList) {
    callback();
  }
}

async function routine() {
  const newArticles = await new Promise((resolve) => {
    const req = new XMLHttpRequest();

    req.open('GET', window.location.href);
    req.responseType = 'document';
    req.addEventListener('load', () => {
      const rootView = req.response.querySelector('div.board-article-list .list-table');
      const articles = Parser.queryItems('articles', null, rootView);
      resolve(articles);
    });
    req.send();
  });
  swapNewArticle(newArticles);
  animate();
}

function animate() {
  loader.removeAttribute('style');
  setTimeout(() => {
    loader.setAttribute('style', `animation: loaderspin ${refreshTime}s ease-in-out`);
  }, 50);
}

function setLoop() {
  loopInterval = setInterval(() => routine(), refreshTime * 1000);
}

function start() {
  animate();
  setLoop();
}

function stop() {
  clearInterval(loopInterval);
  loopInterval = null;
}
