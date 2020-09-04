import { defaultConfig } from './Setting';

import styles from '../css/Refresher.module.css';

export function removeArticle(articles) {
    const form = document.querySelector('.batch-delete-form');
    if(form == null) return false;

    const userlist = GM_getValue('autoRemoveUser', defaultConfig.autoRemoveUser);
    const keywordlist = GM_getValue('autoRemoveKeyword', defaultConfig.autoRemovekeyword);

    const articleid = [];

    articles.forEach(item => {
        const title = item.querySelector('.col-title');
        const author = item.querySelector('.col-author');
        const checkbox = item.querySelector('.batch-check');

        const authorAllow = userlist.length == 0 ? false : new RegExp(userlist.join('|')).test(author.innerText);
        const titleAllow = keywordlist.length == 0 ? false : new RegExp(keywordlist.join('|')).test(title.innerText);

        if((titleAllow || authorAllow)) {
            if(GM_getValue('useAutoRemoverTest', defaultConfig.useAutoRemoverTest)) {
                item.classList.add(styles.target);
            }
            else {
                articleid.push(checkbox.getAttribute('data-id'));
            }
        }
    });

    if(articleid.length > 0 && !GM_getValue('useAutoRemoverTest', defaultConfig.useAutoRemoverTest)) {
        form.querySelector('input[name="articleIds"]').value = articleid.join(',');
        form.submit();
        return true;
    }

    return false;
}
