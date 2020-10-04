import DefaultConfig from '../core/DefaultConfig';

export default {
    blockPreview,
    blockContent,
    blockEmoticon,
    blockRatedown,
};

function blockPreview(rootView, channel) {
    const categoryConfig = GM_getValue('category', DefaultConfig.category);
    const articles = rootView.querySelectorAll('a.vrow');

    articles.forEach(article => {
        const badge = article.querySelector('.badge');
        if(badge == null) return;

        let category = badge.textContent;
        category = (category == '') ? '일반' : category;
        const preview = article.querySelector('.vrow-preview');

        if(categoryConfig[channel] && categoryConfig[channel][category]) {
            const filtered = categoryConfig[channel][category].blockPreview || false;

            if(filtered && preview != null) preview.remove();
        }
    });
}

const ContentTypeString = {
    keyword: '키워드',
    user: '사용자',
    category: '카테고리',
    notice: '공지',
    deleted: '삭제됨',
    all: '전체',
};

function blockContent(rootView, channel) {
    if(document.readyState != 'complete') {
        window.addEventListener('load', () => {
            blockContent(rootView, channel);
        }, { once: true });
        return;
    }

    const count = {};
    for(const key of Object.keys(ContentTypeString)) {
        count[key] = 0;
    }

    let userlist = GM_getValue('blockUser', DefaultConfig.blockUser);
    let keywordlist = GM_getValue('blockKeyword', DefaultConfig.blockKeyword);
    const categoryConfig = GM_getValue('category', DefaultConfig.category);

    if((unsafeWindow.LiveConfig || undefined) && unsafeWindow.LiveConfig.mute != undefined) {
        userlist.push(...unsafeWindow.LiveConfig.mute.users);
        keywordlist.push(...unsafeWindow.LiveConfig.mute.keywords);
        userlist = Array.from(new Set(userlist));
        keywordlist = Array.from(new Set(keywordlist));
    }

    let contents = null;
    let keywordSelector = '';
    let targetElement = null;
    let insertPosition = '';
    if(rootView.classList.contains('list-table')) {
        contents = rootView.querySelectorAll('a.vrow');
        keywordSelector = '.col-title';
        targetElement = rootView;
        insertPosition = 'afterbegin';
    }
    else if(rootView.id == 'comment') {
        contents = rootView.querySelectorAll('.comment-item');
        keywordSelector = '.message';
        targetElement = rootView.querySelector('.list-area');
        insertPosition = 'beforebegin';
    }

    contents.forEach(item => {
        const keywordText = item.querySelector(keywordSelector).innerText;
        const userElement = item.querySelector('.user-info');
        const userText = userElement.dataset.id;
        const categoryElement = item.querySelector('.badge');
        let category;
        if(categoryElement == null || categoryElement.textContent == '') {
            category = '일반';
        }
        else {
            category = categoryElement.textContent;
        }

        const keywordAllow = keywordlist.length == 0 ? false : new RegExp(keywordlist.join('|')).test(keywordText);
        const userAllow = userlist.length == 0 ? false : new RegExp(userlist.join('|')).test(userText);
        let categoryAllow = false;

        if(channel && categoryConfig[channel] && categoryConfig[channel][category]) {
            categoryAllow = categoryConfig[channel][category].blockArticle;
        }

        if(keywordAllow) {
            item.classList.add('filtered');
            item.classList.add('filtered-keyword');
            count.keyword += 1;
        }

        if(userAllow) {
            item.classList.add('filtered');
            item.classList.add('filtered-user');
            count.user += 1;
        }

        if(categoryAllow) {
            item.classList.add('filtered');
            item.classList.add('filtered-category');
            count.category += 1;
        }

        if(item.classList.contains('notice-board') && item.nextElementSibling.classList.contains('notice-board')) {
            item.classList.add('filtered');
            item.classList.add('filtered-notice');
            count.notice += 1;
        }

        if(item.classList.contains('deleted')) {
            item.classList.add('filtered');
            item.classList.add('filtered-deleted');
        }

        if(item.classList.contains('filtered')) count.all += 1;
    });

    let toggleHeader = rootView.querySelector('.frontend-header');
    if(toggleHeader) toggleHeader.remove();
    toggleHeader = (
        <div class="frontend-header">
            <span class="filter-title">필터된 게시물</span>
            <span class="filter-count-container" />
        </div>
    );

    const container = toggleHeader.querySelector('.filter-count-container');

    if(count.all > 0) {
        targetElement.insertAdjacentElement(insertPosition, toggleHeader);

        for(const key of Object.keys(count)) {
            if(count[key] > 0) {
                let className = `show-filtered-${key}`;
                if(key == 'all') className = 'show-filtered';

                const btn = <span class={`filter-count filter-count-${key}`}>{ContentTypeString[key]} ({count[key]})</span>;
                container.append(btn);
                btn.addEventListener('click', () => {
                    if(targetElement.classList.contains(className)) {
                        targetElement.classList.remove(className);
                        toggleHeader.classList.remove(className);
                    }
                    else {
                        targetElement.classList.add(className);
                        toggleHeader.classList.add(className);
                    }
                });
                if(key == 'notice') {
                    // eslint-disable-next-line no-loop-func
                    btn.addEventListener('click', () => {
                        if(targetElement.classList.contains(className)) {
                            GM_setValue('hideNotice', false);
                        }
                        else {
                            GM_setValue('hideNotice', true);
                        }
                    });
                }
            }
        }
    }

    const noticeConfig = GM_getValue('hideNotice', DefaultConfig.hideNotice);
    if(!noticeConfig) targetElement.classList.add('show-filtered-notice');
}

function blockEmoticon(comments) {
    const blockEmoticons = GM_getValue('blockEmoticon', DefaultConfig.blockEmoticon);

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

function blockRatedown() {
    if(!GM_getValue('blockRatedown', DefaultConfig.blockRatedown)) return;

    const ratedown = document.querySelector('#rateDown');
    if(ratedown == null) return;

    ratedown.addEventListener('click', e => {
        if(!confirm('비추천을 눌렀습니다.\n계속하시겠습니까?')) {
            e.preventDefault();
        }
    });
}
