import Parser from '../core/Parser';
import { getTimeStr, in24 } from '../util/DateManager';
import DefaultConfig from '../core/DefaultConfig';

import refreshersheet from '../css/AutoRefresher.css';

export default class AutoRefresher {
    static instance;

    constructor(rootView) {
        if(AutoRefresher.instance) return AutoRefresher.instance;

        this.rootView = rootView;
        this.refreshTime = GM_getValue('refreshTime', DefaultConfig.refreshTime);

        if(this.refreshTime == 0) return this;

        this.loaderView = (
            <div id="autoRefresher" class={GM_getValue('hideRefresher', DefaultConfig.hideRefresher) ? 'hidden' : ''}>
                <style>{refreshersheet}</style>
            </div>
        );
        rootView.append(this.loaderView);
        this.loopInterval = null;

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) this.stop();
            else if (this.loopInterval == null) this.start();
        });
        rootView.addEventListener('click', event => {
            if(event.target.tagName != 'INPUT') return;

            if(event.target.classList.contains('batch-check-all')) {
                if(event.target.checked) this.stop();
                else this.start();
            }
            else {
                const btns = this.rootView.querySelectorAll('.batch-check');
                for(const btn of btns) {
                    if(btn.checked) {
                        this.stop();
                        return;
                    }
                }

                this.start();
            }
        });

        AutoRefresher.instance = this;
        return this;
    }

    swapNewArticle(newArticles) {
        const oldArticles = Parser.getArticles(this.rootView);

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

        this.rootView.append(...newArticles);
        const noticeUnfilterBtn = this.rootView.querySelector('.notice-unfilter');
        const firstArticle = this.rootView.querySelector('a.vrow:not(.notice)');
        firstArticle.insertAdjacentElement('beforebegin', noticeUnfilterBtn);

        this.rootView.dispatchEvent(new CustomEvent('ar_refresh'));
    }

    async routine() {
        const newArticles = await new Promise((resolve) => {
            const req = new XMLHttpRequest();

            req.open('GET', window.location.href);
            req.responseType = 'document';
            req.addEventListener('load', () => {
                const rootView = req.response.querySelector('div.board-article-list .list-table');
                const articles = Parser.getArticles(rootView);
                resolve(articles);
            });
            req.send();
        });
        this.swapNewArticle(newArticles);
        this.animate();
    }

    animate() {
        this.loaderView.removeAttribute('style');
        setTimeout(() => {
            this.loaderView.setAttribute('style', `animation: loaderspin ${this.refreshTime}s ease-in-out`);
        }, 50);
    }

    setLoop() {
        this.loopInterval = setInterval(() => this.routine(), this.refreshTime * 1000);
    }

    start() {
        if(this.refreshTime == 0) return;
        this.animate();
        this.setLoop();
    }

    stop() {
        clearInterval(this.loopInterval);
        this.loopInterval = null;
    }
}
