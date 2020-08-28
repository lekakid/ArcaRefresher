import * as Setting from './Setting';

import styles, { stylesheet as buttonsheet } from '../css/HideNoticeBtn.module.css';

export function applyNotice() {
    document.head.append(<style>{buttonsheet}</style>);
    const btn = <a class={styles.button} href="#">공지사항 펼치기 ▼</a>;

    const list = document.querySelector('.board-article-list .list-table, .included-article-list .list-table');
    list.querySelector('.head').insertAdjacentElement('afterend', btn);

    if(!window.config.hideNotice) {
        list.classList.add('show-notice');
        btn.textContent = '공지사항 숨기기 ▲';
    }

    btn.addEventListener('click', event => {
        event.preventDefault();
        if(window.config.hideNotice) {
            list.classList.add('show-notice');
            btn.textContent = '공지사항 숨기기 ▲';
        }
        else {
            list.classList.remove('show-notice');
            btn.textContent = '공지사항 펼치기 ▼';
        }
        window.config.hideNotice = !window.config.hideNotice;
        Setting.save(window.config);
    });
}

export function apply() {
    const config = window.config;
    const contentWrapper = document.querySelector('.content-wrapper');

    if(!config.hideAvatar) contentWrapper.classList.add('show-avatar');
    if(!config.hideMedia) contentWrapper.classList.add('show-media');
    if(!config.hideModified) contentWrapper.classList.add('show-modified');
    if(!config.hideSideMenu) contentWrapper.classList.add('show-sidemenu');
}
