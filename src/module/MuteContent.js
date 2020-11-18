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
const BLOCK_USER_DEFAULT = '';
const BLOCK_KEYWORD = 'blockKeyword';
const BLOCK_KEYWORD_DEFAULT = '';
const MUTE_CATEGORY = 'muteCategory';
const MUTE_CATEGORY_DEFAULT = {};
const MUTE_NOTICE = 'hideNotice';
const MUTE_NOTICE_DEFAULT = true;

function addSetting() {
    document.head.append(<style>{MuteStyle}</style>);

    const settingElement = (
        <>
            <label class="col-md-3">공지사항 접기</label>
            <div class="col-md-9">
                <select>
                    <option value="false">사용 안 함</option>
                    <option value="true">사용</option>
                </select>
                <p />
            </div>
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
            <label class="col-md-3">카테고리 뮤트</label>
            <div class="col-md-9">
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
                    <tbody />
                </table>
                <p>
                    미리보기 뮤트: 해당 카테고리 게시물의 미리보기를 제거합니다.<br />
                    게시물 뮤트: 해당 카테고리의 게시물을 숨깁니다.
                </p>
            </div>
        </>
    );

    const channel = Parser.getChannelInfo().id;
    const muteNoticeElement = settingElement.querySelector('select');
    const userElement = settingElement.querySelector('textarea[name="user"]');
    const keywordElement = settingElement.querySelector('textarea[name="keyword"]');
    const categoryContainer = settingElement.querySelector('tbody');

    const boardCategoryElements = document.querySelectorAll('.board-category a');

    for(const element of boardCategoryElements) {
        const name = element.textContent == '전체' ? '일반' : element.textContent;
        const muteCategoryItem = (
            <tr data-id={name}>
                <td>{name}</td>
                <td><label><input type="checkbox" name="mutePreview" style="margin: .25em" /> 적용</label></td>
                <td><label><input type="checkbox" name="muteArticle" style="margin: .25em" /> 적용</label></td>
            </tr>
        );
        categoryContainer.append(muteCategoryItem);
    }

    if(boardCategoryElements.length == 0) {
        categoryContainer.append(<tr><td colspan="4"><center>카테고리를 확인할 수 없습니다.</center></td></tr>);
    }

    function load() {
        if(boardCategoryElements.length == 0) return;

        const hideNotice = GM_getValue(MUTE_NOTICE, MUTE_NOTICE_DEFAULT);
        const blockUser = GM_getValue(BLOCK_USER, BLOCK_USER_DEFAULT);
        const blockKeyword = GM_getValue(BLOCK_KEYWORD, BLOCK_KEYWORD_DEFAULT);

        muteNoticeElement.value = hideNotice;
        userElement.value = blockUser.join('\n');
        keywordElement.value = blockKeyword.join('\n');

        const muteCategory = GM_getValue(MUTE_CATEGORY, MUTE_CATEGORY_DEFAULT)[channel];
        if(!muteCategory) return;

        for(const category in muteCategory) {
            if(muteCategory[category]) {
                const row = categoryContainer.querySelector(`tr[data-id="${category}"]`);

                row.querySelector('input[name="mutePreview"]').checked = muteCategory[category].mutePreview;
                row.querySelector('input[name="muteArticle"]').checked = muteCategory[category].muteArticle;
            }
        }
    }
    function save() {
        GM_setValue(MUTE_NOTICE, muteNoticeElement.value == 'true');
        GM_setValue(BLOCK_USER, userElement.value.split('\n').filter(i => i != ''));
        GM_setValue(BLOCK_KEYWORD, keywordElement.value.split('\n').filter(i => i != ''));

        const data = GM_getValue(MUTE_CATEGORY, MUTE_CATEGORY_DEFAULT);
        if(!data[channel]) {
            data[channel] = {};
        }

        const rows = categoryContainer.querySelectorAll('tr');

        for(const row of rows) {
            if(!data[channel][row.dataset.id]) {
                data[channel][row.dataset.id] = {};
            }
            data[channel][row.dataset.id].mutePreview = row.querySelector('input[name="mutePreview"]').checked;
            data[channel][row.dataset.id].muteArticle = row.querySelector('input[name="muteArticle"]').checked;
        }

        GM_setValue(MUTE_CATEGORY, data);
    }

    Configure.addSetting(settingElement, Configure.categoryKey.MUTE, save, load);
}

function addArticleMenu() {
    const userList = GM_getValue(BLOCK_USER, BLOCK_USER_DEFAULT);
    const articleInfo = Parser.getArticleInfo();
    const user = articleInfo.author;
    const userID = articleInfo.authorID.replace('(', '\\(').replace(')', '\\)').replace('.', '\\.');
    const filter = `${user == userID ? '^' : ''}${userID}$`;
    const indexed = userList.indexOf(filter);

    if(indexed > -1) {
        const btn = ArticleMenu.appendMenuBtn('뮤트 해제', 'ion-ios-refresh-empty', '게시물 작성자의 뮤트를 해제합니다.');
        btn.addEventListener('click', event => {
            event.preventDefault();

            userList.splice(indexed, 1);
            GM_setValue(BLOCK_USER, userList);
            location.reload();
        });
    }
    else {
        const btn = ArticleMenu.appendMenuBtn('뮤트', 'ion-ios-close', '게시물 작성자를 뮤트합니다.');
        btn.addEventListener('click', event => {
            event.preventDefault();

            userList.push(filter);
            GM_setValue(BLOCK_USER, userList);
            history.back();
        });
    }
}

function mutePreview() {
    const config = GM_getValue(MUTE_CATEGORY, MUTE_CATEGORY_DEFAULT);
    const channel = Parser.getChannelInfo().id;
    const articles = Parser.queryItems('articles', 'board');

    articles.forEach(article => {
        const badge = article.querySelector('.badge');
        if(badge == null) return;

        let category = badge.textContent;
        category = (category == '') ? '일반' : category;
        const preview = article.querySelector('.vrow-preview');

        if(config[channel] && config[channel][category]) {
            const filtered = config[channel][category].mutePreview || false;

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

function muteContent(viewQuery) {
    if(document.readyState != 'complete') {
        window.addEventListener('load', () => {
            muteContent(viewQuery);
        }, { once: true });
        return;
    }

    const articleBoard = Parser.queryView(viewQuery);

    // 댓글창 오류 방지로 대충 떼움. 나중에 고칠래
    const unfilterBtn = articleBoard.querySelector('.notice-unfilter') || articleBoard;
    const noticeCountElement = unfilterBtn.querySelector('.notice-filter-count');
    if(noticeCountElement && noticeCountElement.textContent == '0') {
        // 사용자가 공식 공지 숨기기 기능을 사용하지 않음
        unfilterBtn.addEventListener('click', () => {
            articleBoard.classList.add('show-filtered-notice');
            unfilterBtn.style.display = 'none';
        });
    }

    const channel = Parser.getChannelInfo().id;

    const count = {};
    for(const key of Object.keys(ContentTypeString)) {
        count[key] = 0;
    }
    let noticeCount = 0;

    let userlist = GM_getValue(BLOCK_USER, BLOCK_USER_DEFAULT);
    let keywordlist = GM_getValue(BLOCK_KEYWORD, BLOCK_KEYWORD_DEFAULT);
    const categoryConfig = GM_getValue(MUTE_CATEGORY, MUTE_CATEGORY_DEFAULT);
    let noticeConfig = unsafeWindow.LiveConfig.hideChannelNotice;
    noticeConfig = noticeConfig || GM_getValue(MUTE_NOTICE, MUTE_NOTICE_DEFAULT);

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
        targetElement = articleBoard;
        insertPosition = 'afterbegin';
    }
    else if(viewQuery == 'comment') {
        contents = Parser.queryItems('comments', 'comment');
        keywordSelector = '.message';
        targetElement = articleBoard.querySelector('.list-area');
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

        if(channel && categoryConfig[channel] && categoryConfig[channel][category]) {
            categoryAllow = categoryConfig[channel][category].muteArticle;
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

    let toggleHeader = articleBoard.querySelector('.frontend-header');
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

    if(noticeCount > 0 && !articleBoard.classList.contains('show-filtered-notice')) {
        unfilterBtn.style.display = '';
        noticeCountElement.textContent = noticeCount;
    }
}
