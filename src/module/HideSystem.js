import * as Setting from './Setting';

import noticesheet from '../css/HideNotice.css';
import avatarsheet from '../css/HideAvatar.css';
import modifiedsheet from '../css/HideModified.css';
import mediasheet from '../css/HideMedia.css';
import styles, { stylesheet as buttonsheet } from '../css/HideNoticeBtn.module.css';

export function applyNotice() {
    const css = <style>{noticesheet}</style>;
    const btn = <a class={`vrow ${styles.button}`} href="#">공지사항 숨기기 ▲</a>;
    document.head.append(<style>{buttonsheet}</style>);

    if(window.config.hideNotice) {
        document.head.append(css);
        btn.innerText = '공지사항 펼치기 ▼';
    }

    const list = document.querySelector('.board-article-list .list-table, .included-article-list .list-table');
    list.querySelector('.head').insertAdjacentElement('afterend', btn);
    btn.addEventListener('click', event => {
        event.preventDefault();
        if(window.config.hideNotice) {
            css.remove();
            btn.innerText = '공지사항 숨기기 ▲';
        }
        else {
            document.head.append(css);
            btn.innerText = '공지사항 펼치기 ▼';
        }
        window.config.hideNotice = !window.config.hideNotice;
        Setting.save(window.config);
    });
}

export function applyModified() {
    const css = <style>{modifiedsheet}</style>;

    if(window.config.hideModified) {
        document.head.append(css);
    }
}

export function applyAvatar() {
    const css = <style>{avatarsheet}</style>;

    if(window.config.hideAvatar) {
        document.head.append(css);
    }
}

export function applyMedia() {
    const css = <style>{mediasheet}</style>;

    if(window.config.hideMedia) {
        document.head.append(css);
    }
}
