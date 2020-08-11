export function blockArticle(articles) {
    if(document.readyState != 'complete') {
        window.addEventListener('load', () => {
            blockArticle(articles);
        });
        return;
    }

    const list = document.querySelector('.board-article-list .list-table, .included-article-list .list-table');

    let toggleBtn = document.querySelector('.vrow.frontend-header');
    if(toggleBtn == null) {
        toggleBtn = <div class="vrow frontend-header"><span class="mute-count">뮤트 카운트</span></div>;
        toggleBtn.addEventListener('click', () => {
            if(list.classList.contains('show-muted')) {
                list.classList.remove('show-muted');
            }
            else {
                list.classList.add('show-muted');
            }
        });
    }

    const live = unsafeWindow.LiveConfig.mute;

    const userlist = live.users.length == 0 ? window.config.blockUser : live.users;
    const keywordlist = live.keywords.length == 0 ? window.config.blockKeyword : live.keywords;

    let muteCount = 0;

    articles.forEach(item => {
        const title = item.querySelector('.col-title');
        const author = item.querySelector('.col-author');

        const authorAllow = userlist.length == 0 ? false : new RegExp(userlist.join('|')).test(author.innerText);
        const titleAllow = keywordlist.length == 0 ? false : new RegExp(keywordlist.join('|')).test(title.innerText);

        if((titleAllow || authorAllow) && !item.classList.contains('muted')) {
            item.classList.add('muted');
            muteCount += 1;
        }
    });

    if(muteCount > 0) {
        if(toggleBtn.parentNode == null) {
            list.prepend(toggleBtn);
        }
        toggleBtn.querySelector('.mute-count').innerText = `${muteCount}개 글 뮤트됨`;
    }
}

export function blockComment(comments) {
    comments.forEach(item => {
        const author = item.querySelector('.user-info');
        const message = item.querySelector('.message');

        const userlist = window.config.blockUser;
        const keywordlist = window.config.blockKeyword;

        const authorAllow = userlist.length == 0 ? false : new RegExp(userlist.join('|')).test(author.innerText);
        const textAllow = keywordlist.length == 0 ? false : new RegExp(keywordlist.join('|')).test(message.innerText);

        if(textAllow || authorAllow) {
            author.innerText = '차단';
            message.innerText = '차단된 댓글입니다.';
            if(message) message.style = 'color: #777';
        }
    });
}

export function blockEmoticon(comments) {
    let list = [];
    for(const key in window.config.blockEmoticon) {
        if({}.hasOwnProperty.call(window.config.blockEmoticon, key)) {
            list = list.concat(window.config.blockEmoticon[key].bundle);
        }
    }

    comments.forEach(item => {
        const emoticon = item.querySelector('.emoticon');

        if(emoticon) {
            const id = emoticon.getAttribute('data-id');
            if(list.indexOf(id) > -1) {
                emoticon.parentNode.innerText = '[아카콘 차단됨]';
            }
        }
    });
}
