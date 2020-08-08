export function blockArticle(articles) {
    articles.forEach(item => {
        const title = item.querySelector('.col-title');
        const author = item.querySelector('.col-author');
        const preview = item.querySelector('.vrow-preview');

        const userlist = window.config.blockUser;
        const keywordlist = window.config.blockKeyword;

        const authorAllow = userlist == '' ? false : new RegExp(userlist.join('|')).test(author.innerText);
        const titleAllow = keywordlist == '' ? false : new RegExp(keywordlist.join('|')).test(title.innerText);

        if(titleAllow || authorAllow) {
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

        const userlist = window.config.blockUser;
        const keywordlist = window.config.blockKeyword;

        const authorAllow = userlist == '' ? false : new RegExp(userlist.join('|')).test(author.innerText);
        const textAllow = keywordlist == '' ? false : new RegExp(keywordlist.join('|')).test(message.innerText);

        if(textAllow || authorAllow) {
            author.innerText = '차단';
            message.innerText = '차단된 댓글입니다.';
            if(message) message.style = 'color: #777';
        }
    });
}

export function blockEmoticon(comments) {
    comments.forEach(item => {
        const emoticon = item.querySelector('.emoticon');

        if(emoticon) {
            const id = emoticon.getAttribute('data-id');
            if(window.config.blockEmoticon.hasOwnProperty(id)) {
                emoticon.parentNode.innerText = '[아카콘 차단됨]';
            }
        }
    });
}
