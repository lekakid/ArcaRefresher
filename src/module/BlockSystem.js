import { defaultConfig } from './Setting';

export function blockArticle(articles, channel) {
    if(document.readyState != 'complete') {
        window.addEventListener('load', () => {
            blockArticle(articles, channel);
        }, { once: true });
        return;
    }

    const count = {
        user: 0,
        keyword: 0,
        category: 0,
        all: 0,
    };

    let userlist = GM_getValue('blockUser', defaultConfig.blockUser);
    let keywordlist = GM_getValue('blockKeyword', defaultConfig.blockKeyword);
    const categoryConfig = GM_getValue('category', defaultConfig.category);

    if((unsafeWindow.LiveConfig || undefined) && unsafeWindow.LiveConfig.mute != undefined) {
        userlist.push(...unsafeWindow.LiveConfig.mute.users);
        keywordlist.push(...unsafeWindow.LiveConfig.mute.keywords);
        userlist = Array.from(new Set(userlist));
        keywordlist = Array.from(new Set(keywordlist));
    }

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

        if(titleAllow) {
            item.classList.add('filtered');
            item.classList.add('filtered-keyword');
            count.keyword += 1;
        }

        if(authorAllow) {
            item.classList.add('filtered');
            item.classList.add('filtered-user');
            count.user += 1;
        }

        if(categoryAllow) {
            item.classList.add('filtered');
            item.classList.add('filtered-category');
            count.category += 1;
        }

        if(item.classList.contains('filtered')) count.all += 1;
    });

    const list = document.querySelector('.board-article-list .list-table, .included-article-list .list-table');
    let toggleHeader = list.querySelector('.frontend-header');

    if(toggleHeader) toggleHeader.remove();

    toggleHeader = (
        <div class="frontend-header">
            <span class="filter-title">필터된 게시물</span>
            <span class="filter-count-container" />
        </div>
    );

    const container = toggleHeader.querySelector('.filter-count-container');

    if(count.all > 0) {
        list.prepend(toggleHeader);

        for(const key of Object.keys(count)) {
            if(count[key] > 0) {
                let className = `show-filtered-${key}`;
                if(key == 'all') className = 'show-filtered';

                let text;
                switch(key) {
                case 'all':
                    text = '전체';
                    break;
                case 'user':
                    text = '사용자';
                    break;
                case 'keyword':
                    text = '키워드';
                    break;
                case 'category':
                    text = '카테고리';
                    break;
                default:
                    break;
                }

                const btn = <span class={`filter-count filter-count-${key}`}>{text} ({count[key]})</span>;
                container.append(btn);
                btn.addEventListener('click', () => {
                    if(list.classList.contains(className)) {
                        list.classList.remove(className);
                    }
                    else {
                        list.classList.add(className);
                    }
                });
            }
        }
    }
}

export function blockComment(comments) {
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
            author.innerText = '뮤트';
            message.innerText = '뮤트된 댓글입니다.';
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
                emoticon.closest('.message').innerText = '[아카콘 뮤트됨]';
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
