import { defaultConfig } from './Setting';

export function blockArticle(articles, channel) {
    if(document.readyState != 'complete') {
        window.addEventListener('load', () => {
            blockArticle(articles, channel);
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

    let userlist = GM_getValue('blockUser', defaultConfig.blockUser);
    let keywordlist = GM_getValue('blockKeyword', defaultConfig.blockKeyword);
    const categoryConfig = GM_getValue('category', defaultConfig.category);

    if(live) {
        userlist = live.users.length == 0 ? userlist : live.users;
        keywordlist = live.keywords.length == 0 ? keywordlist : live.keywords;
    }

    let muteCount = 0;

    articles.forEach(item => {
        const title = item.querySelector('.col-title');
        const author = item.querySelector('.col-author');
        const categoryElement = item.querySelector('.badge');
        let category;
        if(categoryElement == null || categoryElement.textContent == '') {
            category = '일반';
        }
        else {
            category = categoryElement.textContent;
        }

        const authorAllow = userlist.length == 0 ? false : new RegExp(userlist.join('|')).test(author.innerText);
        const titleAllow = keywordlist.length == 0 ? false : new RegExp(keywordlist.join('|')).test(title.innerText);
        let categoryAllow = false;
        if(categoryConfig[channel] && categoryConfig[channel][category]) {
            categoryAllow = categoryConfig[channel][category].blockArticle;
        }

        if((titleAllow || authorAllow || categoryAllow) && !item.classList.contains('muted')) {
            item.classList.add('muted');
            muteCount += 1;
        }
    });

    if(muteCount > 0) {
        if(toggleBtn.parentNode == null) {
            list.prepend(toggleBtn);
        }
    }
    toggleBtn.querySelector('.mute-count').textContent = `${muteCount}개 글 뮤트됨`;
}

export function blockComment(comments) {
    if(document.readyState != 'complete') {
        window.addEventListener('load', () => {
            blockComment(comments);
        });
        return;
    }

    comments.forEach(item => {
        const author = item.querySelector('.user-info');
        const message = item.querySelector('.message');

        const live = unsafeWindow.LiveConfig.mute;

        let userlist = GM_getValue('blockUser', defaultConfig.blockUser);
        let keywordlist = GM_getValue('blockKeyword', defaultConfig.blockKeyword);

        if(live) {
            userlist = live.users.length == 0 ? userlist : live.users;
            keywordlist = live.keywords.length == 0 ? keywordlist : live.keywords;
        }

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
    const blockEmoticons = GM_getValue('blockEmoticon', defaultConfig.blockEmoticon);

    let list = [];
    for(const key in blockEmoticons) {
        if({}.hasOwnProperty.call(blockEmoticons, key)) {
            list = list.concat(blockEmoticons[key].bundle);
        }
    }

    comments.forEach(item => {
        const emoticon = item.querySelector('.emoticon');

        if(emoticon) {
            const id = emoticon.dataset.id;
            if(list.indexOf(id) > -1) {
                emoticon.closest('.message').innerText = '[아카콘 차단됨]';
            }
        }
    });
}

export function blockRatedown() {
    if(!GM_getValue('blockRatedown', defaultConfig.blockRatedown)) return;

    const ratedown = document.querySelector('#rateDown');
    if(ratedown == null) return;

    ratedown.addEventListener('click', e => {
        if(!confirm('비추천을 눌렀습니다.\n계속하시겠습니까?')) {
            e.preventDefault();
        }
    });
}
