import ArticleMenu from '../core/ArticleMenu';
import Configure from '../core/Configure';
import Parser from '../core/Parser';

import MuteStyle from '../css/MuteContent.css';

export default {
    addSetting,
    addArticleMenu,
    mutePreview,
    muteContent,
};

const BLOCK_USER = 'blockUser';
const BLOCK_KEYWORD = 'blockKeyword';
const MUTE_CATEGORY = 'muteCategory';
const MUTE_NOTICE = 'hideNotice';

function addSetting() {
    document.head.append(<style>{MuteStyle}</style>);

    const hideNotice = (
        <select>
            <option value="false">사용 안 함</option>
            <option value="true">사용</option>
        </select>
    );
    Configure.addSetting({
        category: Configure.categoryKey.MUTE,
        header: '공지사항 접기',
        option: hideNotice,
        description: '',
        callback: {
            save() {
                GM_setValue(MUTE_NOTICE, hideNotice.value == 'true');
            },
            load() {
                hideNotice.value = GM_getValue(MUTE_NOTICE, false);
            },
        },
    });

    const userMute = <textarea rows="6" placeholder="뮤트할 이용자의 닉네임을 입력, 줄바꿈으로 구별합니다." />;
    Configure.addSetting({
        category: Configure.categoryKey.MUTE,
        header: '사용자 뮤트',
        option: userMute,
        description: '지정한 유저의 게시물과 댓글을 숨깁니다.',
        callback: {
            save() {
                GM_setValue(BLOCK_USER, userMute.value.split('\n').filter(i => i != ''));
            },
            load() {
                userMute.value = GM_getValue(BLOCK_USER, false).join('\n');
            },
        },
    });

    const keywordMute = <textarea rows="6" placeholder="뮤트할 키워드를 입력, 줄바꿈으로 구별합니다." />;
    Configure.addSetting({
        category: Configure.categoryKey.MUTE,
        header: '키워드 뮤트',
        option: keywordMute,
        description: '지정한 키워드가 포함된 제목을 가진 게시물과 댓글을 숨깁니다.',
        callback: {
            save() {
                GM_setValue(BLOCK_KEYWORD, keywordMute.value.split('\n').filter(i => i != ''));
            },
            load() {
                keywordMute.value = GM_getValue(BLOCK_KEYWORD, false).join('\n');
            },
        },
    });

    const boardCategoryElements = document.querySelectorAll('.board-category a');
    if(!boardCategoryElements.length) return;

    const tbody = <tbody />;
    const categoryMute = (
        <table class="table align-middle">
            <colgroup>
                <col width="40%" />
                <col width="30%" />
                <col width="30%" />
            </colgroup>
            <thead>
                <th>이름</th>
                <th>미리보기 뮤트</th>
                <th>게시물 뮤트</th>
            </thead>
            {tbody}
        </table>
    );

    for(const element of boardCategoryElements) {
        const name = element.textContent == '전체' ? '일반' : element.textContent;
        tbody.append(
            <tr data-id={name}>
                <td>{name}</td>
                <td><label><input type="checkbox" name="mutePreview" style="margin: .25em" /> 적용</label></td>
                <td><label><input type="checkbox" name="muteArticle" style="margin: .25em" /> 적용</label></td>
            </tr>,
        );
    }

    const channel = Parser.getChannelInfo().id;
    Configure.addSetting({
        category: Configure.categoryKey.MUTE,
        header: '카테고리 뮤트',
        option: categoryMute,
        description: (
            <>
                미리보기 뮤트: 해당 카테고리 게시물의 미리보기를 제거합니다.<br />
                게시물 뮤트: 해당 카테고리의 게시물을 숨깁니다.
            </>
        ),
        callback: {
            save() {
                const data = GM_getValue(MUTE_CATEGORY, { [channel]: {} });

                const rows = tbody.querySelectorAll('tr');
                for(const row of rows) {
                    const { id } = row.dataset;
                    data[channel] = {
                        ...data[channel],
                        [id]: {
                            mutePreview: row.querySelector('input[name="mutePreview"]').checked,
                            muteArticle: row.querySelector('input[name="muteArticle"]').checked,
                        },
                    };
                }

                GM_setValue(MUTE_CATEGORY, data);
            },
            load() {
                const muteCategory = GM_getValue(MUTE_CATEGORY, {})[channel];
                if(!muteCategory) return;

                for(const element of tbody.children) {
                    const { id } = element.dataset;

                    if(muteCategory[id]) {
                        element.querySelector('input[name="mutePreview"]').checked = muteCategory[id].mutePreview;
                        element.querySelector('input[name="muteArticle"]').checked = muteCategory[id].muteArticle;
                    }
                }
            },
        },
    });
}

function addArticleMenu() {
    const userList = GM_getValue(BLOCK_USER, []);
    const articleInfo = Parser.getArticleInfo();
    const user = articleInfo.author;
    const userID = articleInfo.authorID.replace('(', '\\(').replace(')', '\\)').replace('.', '\\.');
    const filter = `${user == userID ? '^' : ''}${userID}$`;
    const indexed = userList.indexOf(filter);

    if(indexed > -1) {
        ArticleMenu.appendMenuBtn('뮤트 해제', 'ion-ios-refresh-empty', '게시물 작성자의 뮤트를 해제합니다.', event => {
            event.preventDefault();

            userList.splice(indexed, 1);
            GM_setValue(BLOCK_USER, userList);
            location.reload();
        });
    }
    else {
        ArticleMenu.appendMenuBtn('뮤트', 'ion-ios-close', '게시물 작성자를 뮤트합니다.', event => {
            event.preventDefault();

            userList.push(filter);
            GM_setValue(BLOCK_USER, userList);
            history.back();
        });
    }
}

function mutePreview() {
    const channel = Parser.getChannelInfo().id;
    const config = GM_getValue(MUTE_CATEGORY, {})[channel];
    if(!config) return;

    const articles = Parser.queryItems('articles', 'board');
    articles.forEach(article => {
        const badge = article.querySelector('.badge');
        if(badge == null) return;

        let category = badge.textContent;
        category = (category == '') ? '일반' : category;
        if(!config[category]) return;

        const { mutePreview: filtered } = config[category];
        if(!filtered) return;

        const preview = article.querySelector('.vrow-preview');
        if(preview) preview.remove();
    });
}

const ContentTypeString = {
    keyword: '키워드',
    user: '사용자',
    category: '카테고리',
    deleted: '삭제됨',
    all: '전체',
};

function muteContent(viewQuery) {
    if(document.readyState != 'complete') {
        window.addEventListener('load', () => {
            muteContent(viewQuery);
        }, { once: true });
        return;
    }

    const itemContainer = Parser.queryView(viewQuery);

    let unfilterBtn = itemContainer.querySelector('.notice-unfilter');
    if(viewQuery == 'board' && !unfilterBtn) {
        // 사용자가 공식 공지 숨기기 기능을 사용하지 않음
        unfilterBtn = (
            <a class="vrow notice notice-unfilter">
                <div class="vrow-top">숨겨진 공지 펼치기(<span class="notice-filter-count">0</span>개) <span class="ion-android-archive" /></div>
            </a>
        );
        unfilterBtn.addEventListener('click', () => {
            itemContainer.classList.add('show-filtered-notice');
            unfilterBtn.style.display = 'none';
        });
        itemContainer.querySelector('a.vrow:not(.notice)').insertAdjacentElement('beforebegin', unfilterBtn);
    }

    const channel = Parser.getChannelInfo().id;

    const count = {};
    for(const key of Object.keys(ContentTypeString)) {
        count[key] = 0;
    }
    let noticeCount = 0;

    let userlist = GM_getValue(BLOCK_USER, []);
    let keywordlist = GM_getValue(BLOCK_KEYWORD, []);
    const categoryConfig = GM_getValue(MUTE_CATEGORY, {})[channel];
    let noticeConfig = unsafeWindow.LiveConfig.hideChannelNotice;
    noticeConfig = noticeConfig || GM_getValue(MUTE_NOTICE, false);

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
    if(viewQuery == 'board') {
        contents = Parser.queryItems('articles', 'board');
        keywordSelector = '.col-title';
        targetElement = itemContainer;
        insertPosition = 'afterbegin';
    }
    else if(viewQuery == 'comment') {
        contents = Parser.queryItems('comments', 'comment');
        keywordSelector = '.message';
        targetElement = itemContainer.querySelector('.list-area');
        insertPosition = 'beforebegin';
    }

    contents.forEach(item => {
        const keywordElement = item.querySelector(keywordSelector);
        const userElement = item.querySelector('.user-info');
        if(!keywordElement || !userElement) return;

        const keywordText = keywordElement.innerText;
        const userText = Parser.parseUserInfo(userElement);
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

        if(channel && categoryConfig && categoryConfig[category]) {
            categoryAllow = categoryConfig[category].muteArticle;
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

    let toggleHeader = itemContainer.querySelector('.frontend-header');
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

    if(noticeCount > 0 && !itemContainer.classList.contains('show-filtered-notice')) {
        const noticeCountElement = unfilterBtn.querySelector('.notice-filter-count');
        noticeCountElement.textContent = noticeCount;
    }
}
