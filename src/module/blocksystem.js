export function blockArticle(articles) {
    articles.forEach(item => {
        const title = item.querySelector('.col-title');
        const author = item.querySelector('.col-author');
        const preview = item.querySelector('.vrow-preview');

        const userlist = window.setting.blockUser;
        const keywordlist = window.setting.blockKeyword;

        const author_allow = userlist == '' ? false : new RegExp(userlist.join('|')).test(author.innerText);
        const title_allow = keywordlist == '' ? false : new RegExp(keywordlist.join('|')).test(title.innerText);

        if(title_allow || author_allow) {
            item.setAttribute('data-url', item.href);
            item.removeAttribute('href');
            item.style = 'color: #777';
            title.innerText = '차단된 게시물입니다.';
            author.innerText = '차단';
            if(preview) preview.remove();
        }
    });
}

export function blockComment(comments) {
    comments.forEach(item => {
        const author = item.querySelector('.user-info');
        const message = item.querySelector('.message');

        const userlist = window.setting.blockUser;
        const keywordlist = window.setting.blockKeyword;

        const author_allow = userlist == '' ? false : new RegExp(userlist.join('|')).test(author.innerText);
        const text_allow = keywordlist == '' ? false : new RegExp(keywordlist.join('|')).test(message.innerText);

        if(text_allow || author_allow) {
            author.innerText = '차단';
            message.innerText = '차단된 댓글입니다.';
            if(message) message.style = 'color: #777';
        }
    });
}
