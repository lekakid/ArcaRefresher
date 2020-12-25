import Configure from '../core/Configure';
import Parser from '../core/Parser';

export default { addSetting, remove };

const AUTO_REMOVE_USER = 'autoRemoveUser';
const AUTO_REMOVE_KEYWORD = 'autoRemoveKeyword';
const USE_AUTO_REMOVER_TEST = 'useAutoRemoverTest';

function addSetting() {
    const removeTestMode = (
        <select>
            <option value="false">사용 안 함</option>
            <option value="true">사용</option>
        </select>
    );
    Configure.addSetting({
        category: Configure.categoryKey.CHANNEL_ADMIN,
        header: '삭제 테스트 모드',
        option: removeTestMode,
        description: '게시물을 삭제하지 않고 어떤 게시물이 선택되는지 붉은 색으로 보여줍니다.',
        callback: {
            save() {
                GM_setValue(USE_AUTO_REMOVER_TEST, removeTestMode.value == 'true');
            },
            load() {
                removeTestMode.value = GM_getValue(USE_AUTO_REMOVER_TEST, true);
            },
        },
    });

    const removeKeywordList = <textarea rows="6" placeholder="삭제할 키워드를 입력, 줄바꿈으로 구별합니다." />;
    Configure.addSetting({
        category: Configure.categoryKey.CHANNEL_ADMIN,
        header: '게시물 삭제 키워드 목록',
        option: removeKeywordList,
        description: '지정한 유저가 작성한 게시물을 삭제합니다.',
        callback: {
            save: () => {
                GM_setValue(AUTO_REMOVE_USER, removeKeywordList.value.split('\n').filter(i => i != ''));
            },
            load: () => {
                removeKeywordList.value = GM_getValue(AUTO_REMOVE_USER, []).join('\n');
            },
        },
    });

    const removeUserList = <textarea rows="6" placeholder="삭제할 이용자의 닉네임을 입력, 줄바꿈으로 구별합니다." />;
    Configure.addSetting({
        category: Configure.categoryKey.CHANNEL_ADMIN,
        header: '게시물 삭제 유저 목록',
        option: removeUserList,
        description: '지정한 키워드가 포함된 제목을 가진 게시물을 삭제합니다.',
        callback: {
            save: () => {
                GM_setValue(AUTO_REMOVE_USER, removeUserList.value.split('\n').filter(i => i != ''));
            },
            load: () => {
                removeUserList.value = GM_getValue(AUTO_REMOVE_USER, []).join('\n');
            },
        },
    });
}

function remove() {
    const form = document.querySelector('.batch-delete-form');
    if(form == null) return false;

    const userlist = GM_getValue(AUTO_REMOVE_USER, []);
    const keywordlist = GM_getValue(AUTO_REMOVE_KEYWORD, []);
    const testMode = GM_getValue(USE_AUTO_REMOVER_TEST, true);

    const articles = Parser.queryItems('articles', 'board');
    const articleid = [];

    articles.forEach(item => {
        const titleElement = item.querySelector('.col-title');
        const userElement = item.querySelector('.user-info');
        if(!titleElement || !userElement) return;
        const title = titleElement.innerText;
        const author = Parser.parseUserID(userElement);
        const checkbox = item.querySelector('.batch-check');

        const authorAllow = userlist.length == 0 ? false : new RegExp(userlist.join('|')).test(author);
        const titleAllow = keywordlist.length == 0 ? false : new RegExp(keywordlist.join('|')).test(title);

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
