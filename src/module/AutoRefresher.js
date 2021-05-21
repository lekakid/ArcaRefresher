import { dispatchAREvent } from '../core/AREventHandler';
import { addSetting, getValue, setValue } from '../core/Configure';
import { getTimeStr, in24 } from '../util/DateManager';

import refreshersheet from '../css/AutoRefresher.css';
import { waitForElement } from '../core/LoadManager';
import { ARTICLE_LOADED, BOARD_LOADED } from '../core/ArcaSelector';

export default { load };

const REFRESH_TIME = { key: 'refreshTime', defaultValue: 3 };
const HIDE_REFRESHER = { key: 'hideRefresher', defaultValue: false };

let refreshTime = 0;
let loader = null;
let loopInterval = null;

async function load() {
  try {
    setupSetting();

    if (await waitForElement(ARTICLE_LOADED)) return;

    if (await waitForElement(BOARD_LOADED)) {
      apply();
    }
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  const refreshTimeSelect = (
    <select>
      <option value="0">사용 안 함</option>
      <option value="5">5초</option>
      <option value="10">10초</option>
      <option value="20">20초</option>
      <option value="30">30초</option>
      <option value="60">1분</option>
    </select>
  );
  const hideRefreshSign = (
    <select>
      <option value="false">보임</option>
      <option value="true">숨김</option>
    </select>
  );
  addSetting({
    header: '자동 새로고침',
    group: [
      {
        title: '갱신 시간 설정',
        content: refreshTimeSelect,
      },
      {
        title: '회전하는 원 애니메이션 숨김',
        content: hideRefreshSign,
      },
    ],
    configHandler: {
      save() {
        setValue(REFRESH_TIME, Number(refreshTimeSelect.value));
        setValue(HIDE_REFRESHER, hideRefreshSign.value === 'true');
      },
      load() {
        refreshTimeSelect.value = getValue(REFRESH_TIME);
        hideRefreshSign.value = getValue(HIDE_REFRESHER);
      },
    },
  });
}

function apply() {
  refreshTime = getValue(REFRESH_TIME);
  if (refreshTime === 0) return;

  const articleList = document.querySelector('div.board-article-list .list-table');

  loader = (
    <div id="autoRefresher" className={getValue(HIDE_REFRESHER) ? 'hidden' : ''}>
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
  const articleList = document.querySelector('div.board-article-list .list-table');
  const oldArticles = [...document.querySelectorAll('a.vrow:not(.notice-unfilter)')];

  let insertLocation = document.querySelector('a.vrow:not(.notice)');

  for (const n of newArticles) {
    const existingArticle = oldArticles.find((o) => o.pathname === n.pathname);

    if (existingArticle) {
      existingArticle.replaceWith(n);
    } else {
      n.setAttribute('style', 'animation: light 0.5s');
      articleList.insertBefore(n, insertLocation);
      insertLocation = n;
    }

    const lazywrapper = n.querySelector('noscript');
    if (lazywrapper) lazywrapper.replaceWith(lazywrapper.firstChild);

    const time = n.querySelector('time');
    if (time && in24(time.dateTime)) {
      time.innerText = getTimeStr(time.dateTime);
    }
  }

  const noticeUnfilterBtn = articleList.querySelector('.notice-unfilter');
  if (noticeUnfilterBtn) {
    const firstArticle = articleList.querySelector('a.vrow:not(.notice)');
    firstArticle.insertAdjacentElement('beforebegin', noticeUnfilterBtn);
  }

  dispatchAREvent('ArticleChange');
}

async function routine() {
  try {
    const newArticles = await new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      req.open('GET', window.location.href);
      req.responseType = 'document';
      req.timeout = 10000;
      req.onload = () => {
        const rootView = req.response.querySelector('div.board-article-list .list-table');
        const articles = rootView.querySelectorAll('a.vrow:not(.notice-unfilter)');
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
    swapNewArticle(newArticles);
  } catch (error) {
    console.error(error);
  }

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
