import * as Setting from './Setting';

import styles, { stylesheet as buttonsheet } from '../css/HideNoticeBtn.module.css';

export function applyNotice() {
    const FOLDED = '공지사항 펼치기 ▼';
    const UNFOLDED = '공지사항 숨기기 ▲';

    document.head.append(<style>{buttonsheet}</style>);
    const btn = <a class={styles.button} href="#">{UNFOLDED}</a>;

    const list = document.querySelector('.board-article-list .list-table, .included-article-list .list-table');
    list.querySelector('.head').insertAdjacentElement('afterend', btn);

    if(window.config.hideNotice) {
        list.classList.add('hide-notice');
        btn.textContent = FOLDED;
    }

    btn.addEventListener('click', event => {
        event.preventDefault();
        if(!window.config.hideNotice) {
            list.classList.add('hide-notice');
            btn.textContent = FOLDED;
        }
        else {
            list.classList.remove('hide-notice');
            btn.textContent = UNFOLDED;
        }
        window.config.hideNotice = !window.config.hideNotice;
        Setting.save(window.config);
    });
}

export function apply() {
    const config = window.config;
    const contentWrapper = document.querySelector('.content-wrapper');

    if(config.hideAvatar) contentWrapper.classList.add('hide-avatar');
    if(config.hideMedia) contentWrapper.classList.add('hide-media');
    if(config.hideModified) contentWrapper.classList.add('hide-modified');
    if(config.hideSideMenu) contentWrapper.classList.add('hide-sidemenu');
}
