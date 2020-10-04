import DefaultConfig from '../core/DefaultConfig';

export default { removeArticle };

function removeArticle(rootView) {
    const form = document.querySelector('.batch-delete-form');
    if(form == null) return false;

    const userlist = GM_getValue('autoRemoveUser', DefaultConfig.autoRemoveUser);
    const keywordlist = GM_getValue('autoRemoveKeyword', DefaultConfig.autoRemoveKeyword);
    const testMode = GM_getValue('useAutoRemoverTest', DefaultConfig.useAutoRemoverTest);

    const articles = rootView.querySelectorAll('a.vrow');
    const articleid = [];

    articles.forEach(item => {
        const title = item.querySelector('.col-title');
        const author = item.querySelector('.col-author');
        const checkbox = item.querySelector('.batch-check');

        const authorAllow = userlist.length == 0 ? false : new RegExp(userlist.join('|')).test(author.innerText);
        const titleAllow = keywordlist.length == 0 ? false : new RegExp(keywordlist.join('|')).test(title.innerText);

        if((titleAllow || authorAllow)) {
            if(testMode) {
                item.classList.add('target');
            }
            else {
                articleid.push(checkbox.getAttribute('data-id'));
            }
        }
    });

    if(articleid.length > 0 && !testMode) {
        form.querySelector('input[name="articleIds"]').value = articleid.join(',');
        form.submit();
        return true;
    }

    return false;
}
