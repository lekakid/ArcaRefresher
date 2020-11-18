import Configure from '../core/Configure';
import Parser from '../core/Parser';
import { getTimeStr, in24 } from '../util/DateManager';

import refreshersheet from '../css/AutoRefresher.css';

export default { addSetting, apply };

const REFRESH_TIME = 'refreshTime';
const REFRESH_TIME_DEFAULT = 3;
const HIDE_REFRESHER = 'hideRefresher';
const HIDE_REFRESHER_DEFAULT = false;

let refreshTime = 0;
let loader = null;
let loopInterval = null;

function addSetting() {
    const settingElement = (
        <>
            <label class="col-md-3">자동 새로고침</label>
            <div class="col-md-9">
                <select name="refreshTime" data-type="number">
                    <option value="0">사용 안 함</option>
                    <option value="3">3초</option>
                    <option value="5">5초</option>
                    <option value="10">10초</option>
                </select>
                <p>일정 시간마다 게시물 목록을 갱신합니다.</p>
            </div>
            <label class="col-md-3">새로고침 애니메이션 숨김</label>
            <div class="col-md-9">
                <select name="hideRefresher" data-type="bool">
                    <option value="false">사용 안 함</option>
                    <option value="true">사용</option>
                </select>
                <p />
            </div>
        </>
    );

    const refreshTimeElement = settingElement.querySelector('select[name="refreshTime"]');
    const hideRefresherElement = settingElement.querySelector('select[name="hideRefresher"]');

    function load() {
        const timeValue = GM_getValue(REFRESH_TIME, REFRESH_TIME_DEFAULT);
        const hideValue = GM_getValue(HIDE_REFRESHER, HIDE_REFRESHER_DEFAULT);

        refreshTimeElement.value = timeValue;
        hideRefresherElement.value = hideValue;
    }
    function save() {
        GM_setValue(REFRESH_TIME, Number(refreshTimeElement.value));
        GM_setValue(HIDE_REFRESHER, hideRefresherElement.value == 'true');
    }

    Configure.addSetting(settingElement, Configure.categoryKey.UTILITY, save, load);
}

function apply() {
    refreshTime = GM_getValue(REFRESH_TIME, REFRESH_TIME_DEFAULT);
    if(refreshTime == 0) return;

    const articleList = Parser.queryView('board');

    loader = (
        <div id="autoRefresher" class={GM_getValue(HIDE_REFRESHER, HIDE_REFRESHER_DEFAULT) ? 'hidden' : ''}>
            <style>{refreshersheet}</style>
        </div>
    );
    articleList.append(loader);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop();
        else if (loopInterval == null) start();
    });
    articleList.addEventListener('click', event => {
        if(event.target.tagName != 'INPUT') return;

        if(event.target.classList.contains('batch-check-all')) {
            if(event.target.checked) stop();
            else start();
        }
        else {
            const btns = articleList.querySelectorAll('.batch-check');
            for(const btn of btns) {
                if(btn.checked) {
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
    for(const o of oldArticles) {
        oldnums.push(o.pathname.split('/')[3]);
        o.remove();
    }

    for(const n of newArticles) {
        if(oldnums.indexOf(n.pathname.split('/')[3]) == -1) {
            n.setAttribute('style', 'animation: light 0.5s');
        }

        const lazywrapper = n.querySelector('noscript');
        if(lazywrapper) lazywrapper.outerHTML = lazywrapper.innerHTML;

        const time = n.querySelector('time');
        if(time && in24(time.dateTime)) {
            time.innerText = getTimeStr(time.dateTime);
        }
    }

    const articleList = Parser.queryView('board');
    articleList.append(...newArticles);
    const noticeUnfilterBtn = articleList.querySelector('.notice-unfilter');
    if(noticeUnfilterBtn) {
        const firstArticle = articleList.querySelector('a.vrow:not(.notice)');
        firstArticle.insertAdjacentElement('beforebegin', noticeUnfilterBtn);
    }

    articleList.dispatchEvent(new CustomEvent('ar_refresh'));
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
