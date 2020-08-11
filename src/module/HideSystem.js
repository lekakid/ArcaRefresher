import * as Setting from './Setting';

import noticesheet from '../css/HideNotice.css';
import avatarsheet from '../css/HideAvatar.css';
import modifiedsheet from '../css/HideModified.css';
import mediasheet from '../css/HideMedia.css';
import sidemenusheet from '../css/HideSideMenu.css';
import styles, { stylesheet as buttonsheet } from '../css/HideNoticeBtn.module.css';

export function applyNotice() {
    document.head.append(<style>{noticesheet}</style>);
    document.head.append(<style>{buttonsheet}</style>);
    const btn = <a class={styles.button} href="#">공지사항 펼치기 ▼</a>;

    const list = document.querySelector('.board-article-list .list-table, .included-article-list .list-table');
    list.querySelector('.head').insertAdjacentElement('afterend', btn);

    if(!window.config.hideNotice) {
        list.classList.add('show-notice');
        btn.innerText = '공지사항 숨기기 ▼';
    }

    btn.addEventListener('click', event => {
        event.preventDefault();
        if(window.config.hideNotice) {
            list.classList.add('show-notice');
            btn.innerText = '공지사항 숨기기 ▲';
        }
        else {
            list.classList.remove('show-notice');
            btn.innerText = '공지사항 펼치기 ▼';
        }
        window.config.hideNotice = !window.config.hideNotice;
        Setting.save(window.config);
    });
}

export function applyModified() {
    if(window.config.hideModified) {
        document.head.append(<style>{modifiedsheet}</style>);
    }
}

export function applyAvatar() {
    if(window.config.hideAvatar) {
        document.head.append(<style>{avatarsheet}</style>);
    }
}

export function applyMedia() {
    if(window.config.hideMedia) {
        document.head.append(<style>{mediasheet}</style>);
    }
}

export function applySideMenu() {
    if(window.config.hideSideMenu) {
        document.head.append(<style>{sidemenusheet}</style>);
    }
}
