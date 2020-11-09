import Setting from '../core/Setting';
import Parser from '../core/Parser';
import DefaultConfig from '../core/DefaultConfig';

export default {
    initialize,
    blockPreview,
    muteContent,
};

const BLOCK_USER = 'blockUser';
const BLOCK_USER_DEFAULT = '';
const BLOCK_KEYWORD = 'blockKeyword';
const BLOCK_KEYWORD_DEFAULT = '';

function initialize() {
    const configElement = (
        <>
            <label class="col-md-3">사용자 뮤트</label>
            <div class="col-md-9">
                <textarea name="user" rows="6" placeholder="뮤트할 이용자의 닉네임을 입력, 줄바꿈으로 구별합니다." />
                <p>지정한 유저의 게시물과 댓글을 숨깁니다.</p>
            </div>
            <label class="col-md-3">키워드 뮤트</label>
            <div class="col-md-9">
                <textarea name="keyword" rows="6" placeholder="뮤트할 키워드를 입력, 줄바꿈으로 구별합니다." />
                <p>지정한 키워드가 포함된 제목을 가진 게시물과 댓글을 숨깁니다.</p>
            </div>
        </>
    );

    const userElement = configElement.querySelector('textarea[name="user"]');
    const keywordElement = configElement.querySelector('textarea[name="keyword"]');

    function load() {
        const blockUser = GM_getValue(BLOCK_USER, BLOCK_USER_DEFAULT);
        const blockKeyword = GM_getValue(BLOCK_KEYWORD, BLOCK_KEYWORD_DEFAULT);

        userElement.value = blockUser.join('\n');
        keywordElement.value = blockKeyword.join('\n');
    }
    function save() {
        GM_setValue(BLOCK_USER, userElement.value.split('\n').filter(i => i != ''));
        GM_setValue(BLOCK_KEYWORD, keywordElement.value.split('\n').filter(i => i != ''));
    }

    Setting.registConfig(configElement, 'muteConfig', save, load);
}

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
    deleted: '삭제됨',
    all: '전체',
};

function muteContent(rootView, channel) {
    if(document.readyState != 'complete') {
        window.addEventListener('load', () => {
            muteContent(rootView, channel);
        }, { once: true });
        return;
    }

    // 댓글창 오류 방지로 대충 떼움. 나중에 고칠래
    const unfilterBtn = rootView.querySelector('.notice-unfilter') || rootView;
    const noticeCountElement = unfilterBtn.querySelector('.notice-filter-count');
    if(noticeCountElement && noticeCountElement.textContent == '0') {
        // 사용자가 공식 공지 숨기기 기능을 사용하지 않음
        unfilterBtn.addEventListener('click', () => {
            rootView.classList.add('show-filtered-notice');
            unfilterBtn.style.display = 'none';
        });
    }

    const count = {};
    for(const key of Object.keys(ContentTypeString)) {
        count[key] = 0;
    }
    let noticeCount = 0;

    let userlist = GM_getValue(BLOCK_USER, BLOCK_USER_DEFAULT);
    let keywordlist = GM_getValue(BLOCK_KEYWORD, BLOCK_KEYWORD_DEFAULT);
    const categoryConfig = GM_getValue('category', DefaultConfig.category);
    const noticeConfig = unsafeWindow.LiveConfig.hideChannelNotice || GM_getValue('hideNotice', DefaultConfig.hideNotice);

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
        contents = Parser.getArticles(rootView);
        keywordSelector = '.col-title';
        targetElement = rootView;
        insertPosition = 'afterbegin';
    }
    else if(rootView.id == 'comment') {
        contents = Parser.getComments(rootView);
        keywordSelector = '.message';
        targetElement = rootView.querySelector('.list-area');
        insertPosition = 'beforebegin';
    }

    contents.forEach(item => {
        const keywordElement = item.querySelector(keywordSelector);
        const userElement = item.querySelector('.user-info');
        if(!keywordElement || !userElement) return;

        const keywordText = keywordElement.innerText;
        const userText = Parser.getUserID(userElement);
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
            count.all += 1;
        }

        if(userAllow) {
            item.classList.add('filtered');
            item.classList.add('filtered-user');
            count.user += 1;
            count.all += 1;
        }

        if(categoryAllow) {
            item.classList.add('filtered');
            item.classList.add('filtered-category');
            count.category += 1;
            count.all += 1;
        }

        if(item.classList.contains('deleted')) {
            item.classList.add('filtered');
            item.classList.add('filtered-deleted');
            count.deleted += 1;
            count.all += 1;
        }

        if(item.classList.contains('notice-board') && item.nextElementSibling.classList.contains('notice-board')) {
            if(noticeConfig) {
                item.classList.add('filtered');
                item.classList.add('filtered-notice');
                noticeCount += 1;
            }
        }
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
            }
        }
    }

    if(noticeCount > 0 && !rootView.classList.contains('show-filtered-notice')) {
        unfilterBtn.style.display = '';
        noticeCountElement.textContent = noticeCount;
    }
}
