import { defaultConfig } from './Setting';

import styles, { stylesheet as buttonsheet } from '../css/HideNoticeBtn.module.css';

export function applyNotice() {
    const FOLDED = '공지사항 펼치기 ▼';
    const UNFOLDED = '공지사항 숨기기 ▲';

    document.head.append(<style>{buttonsheet}</style>);
    const btn = <a class={styles.button} href="#">{UNFOLDED}</a>;

    const list = document.querySelector('.board-article-list .list-table, .included-article-list .list-table');
    list.querySelector('.head').insertAdjacentElement('afterend', btn);

    let hideNotice = GM_getValue('hideNotice', defaultConfig.hideNotice);

    if(hideNotice) {
        list.classList.add('hide-notice');
        btn.textContent = FOLDED;
    }

    btn.addEventListener('click', event => {
        event.preventDefault();
        if(!hideNotice) {
            list.classList.add('hide-notice');
            btn.textContent = FOLDED;
        }
        else {
            list.classList.remove('hide-notice');
            btn.textContent = UNFOLDED;
        }
        hideNotice = !hideNotice;
        GM_setValue('hideNotice', hideNotice);
    });
}

export function apply() {
    const hideAvatar = GM_getValue('hideAvatar', defaultConfig.hideAvatar);
    const hideMedia = GM_getValue('hideMedia', defaultConfig.hideMedia);
    const hideModified = GM_getValue('hideModified', defaultConfig.hideModified);
    const hideSideMenu = GM_getValue('hideSideMenu', defaultConfig.hideSideMenu);

    const contentWrapper = document.querySelector('.content-wrapper');

    if(hideAvatar) contentWrapper.classList.add('hide-avatar');
    if(hideMedia) contentWrapper.classList.add('hide-media');
    if(hideModified) contentWrapper.classList.add('hide-modified');
    if(hideSideMenu) contentWrapper.classList.add('hide-sidemenu');
}
