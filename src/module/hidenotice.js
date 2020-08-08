import * as Setting from './setting';

import noticesheet from '../css/hidenotice.css';
import styles, { stylesheet as buttonsheet } from '../css/hidenoticebtn.module.css';

export function apply() {
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
