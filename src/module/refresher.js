import * as DateManager from './datemanager';
import * as PreviewFilter from './previewfilter.js';
import * as BlockSystem from './blocksystem.js';

import styles, { stylesheet } from '../css/refresher.module.css';

function initLoader() {
    document.head.append(<style>{stylesheet}</style>);
    const loader = <div id="article_loader" class={styles.loader}></div>;
    document.body.append(loader);

    return loader;
}

function playLoader(loader, time) {
    loader.removeAttribute('style');
    setTimeout(function() {
        loader.setAttribute('style', `animation: ${styles.loaderspin} ${time}s ease-in-out`);
    }, 50);
}

function getRefreshArticle() {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();

        req.open('GET', window.location.href);
        req.responseType = 'document';
        req.addEventListener('load', event => {
            const articles = req.response.querySelectorAll('a[class="vrow"]');
            resolve(articles);
        });
        req.send();
    });
}

function swapNewArticle(newArticles) {
    const board = document.querySelector('.board-article-list .list-table, .included-article-list .list-table');
    const oldArticles = board.querySelectorAll('a[class="vrow"]');

    let i = newArticles.length - 1;
    const oldnum = parseInt(oldArticles[0].pathname.split('/')[3]);

    while(i > -1) {
        const newnum = parseInt(newArticles[i].pathname.split('/')[3]);
        if(newnum > oldnum) {
            newArticles[i].setAttribute('style', `animation: ${styles.light} 0.3s`);
        }

        const lazywrapper = newArticles[i].querySelector('noscript');
        if(lazywrapper)
            lazywrapper.outerHTML = lazywrapper.innerHTML;

        const time = newArticles[i].querySelector('time');
        if(DateManager.in24(time.dateTime))
            time.innerText = DateManager.getTimeStr(time.dateTime);
        i--;
    }

    oldArticles.forEach(i => {
        i.remove();
    });
    board.append(...newArticles);

    return newArticles;
}

export function run() {
    const refreshTime = window.setting.refreshTime;

    if(refreshTime == 0)
        return;

    const loader = initLoader();
    playLoader(loader, refreshTime);

    async function routine() {
        const articles = swapNewArticle(await getRefreshArticle());
        playLoader(loader, refreshTime);
        PreviewFilter.filter(articles);
        BlockSystem.blockArticle(articles);
    }
    
    let loader_loop = null;
    loader_loop = setInterval(routine, refreshTime * 1000);
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(loader_loop);
            loader_loop = null;
        } else {
            if (loader_loop == null) {
                playLoader(loader, refreshTime);
                loader_loop = setInterval(routine, refreshTime * 1000);
            }
        }
    });
    document.addEventListener('click', event => {
        if(event.target.tagName != 'INPUT')
            return;

        if(event.target.classList.contains('batch-check-all')) {
            if(event.target.checked) {
                clearInterval(loader_loop);
                loader_loop = null;
            }
            else {
                playLoader(loader, refreshTime);
                loader_loop = setInterval(routine, refreshTime * 1000);
            }
        }
        else {
            const btns = document.querySelectorAll('.batch-check');
            for(let btn of btns) {
                if(btn.checked) {
                    clearInterval(loader_loop);
                    loader_loop = null;
                    return;
                }
            }

            playLoader(loader, refreshTime);
            loader_loop = setInterval(routine, refreshTime * 1000);
        }
    })
}