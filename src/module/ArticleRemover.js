import Configure from '../core/Configure';
import Parser from '../core/Parser';

export default { addSetting, remove };

const AUTO_REMOVE_USER = 'autoRemoveUser';
const AUTO_REMOVE_USER_DEFAULT = [];
const AUTO_REMOVE_KEYWORD = 'autoRemoveKeyword';
const AUTO_REMOVE_KEYWORD_DEFAULT = [];
const USE_AUTO_REMOVER_TEST = 'useAutoRemoverTest';
const USE_AUTO_REMOVER_TEST_DEFAULT = true;

function addSetting() {
    const settingElement = (
        <>
            <label class="col-md-3">삭제 테스트 모드</label>
            <div class="col-md-9">
                <select>
                    <option value="false">사용 안 함</option>
                    <option value="true">사용</option>
                </select>
                <p>게시물을 삭제하지 않고 어떤 게시물이 선택되는지 붉은 색으로 보여줍니다.</p>
            </div>
            <label class="col-md-3">게시물 삭제 유저 목록</label>
            <div class="col-md-9">
                <textarea name="user" rows="6" placeholder="삭제할 이용자의 닉네임을 입력, 줄바꿈으로 구별합니다." />
                <p>지정한 유저가 작성한 게시물을 삭제합니다.</p>
            </div>
            <label class="col-md-3">게시물 삭제 키워드 목록</label>
            <div class="col-md-9">
                <textarea name="keyword" rows="6" placeholder="삭제할 키워드를 입력, 줄바꿈으로 구별합니다." />
                <p>지정한 키워드가 포함된 제목을 가진 게시물을 삭제합니다.</p>
            </div>
        </>
    );

    const selectElement = settingElement.querySelector('select');
    const userElement = settingElement.querySelector('textarea[name="user"]');
    const keywordElement = settingElement.querySelector('textarea[name="keyword"]');

    function load() {
        const testmode = GM_getValue(USE_AUTO_REMOVER_TEST, USE_AUTO_REMOVER_TEST_DEFAULT);
        const users = GM_getValue(AUTO_REMOVE_USER, AUTO_REMOVE_USER_DEFAULT);
        const keywords = GM_getValue(AUTO_REMOVE_KEYWORD, AUTO_REMOVE_KEYWORD_DEFAULT);

        selectElement.value = testmode;
        userElement.value = users.join('\n');
        keywordElement.value = keywords.join('\n');
    }
    function save() {
        GM_setValue(USE_AUTO_REMOVER_TEST, selectElement.value == 'true');
        GM_setValue(AUTO_REMOVE_USER, userElement.value.split('\n').filter(i => i != ''));
        GM_setValue(AUTO_REMOVE_KEYWORD, keywordElement.value.split('\n').filter(i => i != ''));
    }

    Configure.addSetting(settingElement, Configure.categoryKey.CHANNEL_ADMIN, save, load);
}

function remove(rootView) {
    const form = document.querySelector('.batch-delete-form');
    if(form == null) return false;

    const userlist = GM_getValue(AUTO_REMOVE_USER, AUTO_REMOVE_USER_DEFAULT);
    const keywordlist = GM_getValue(AUTO_REMOVE_KEYWORD, AUTO_REMOVE_KEYWORD_DEFAULT);
    const testMode = GM_getValue(USE_AUTO_REMOVER_TEST, USE_AUTO_REMOVER_TEST_DEFAULT);

    const articles = Parser.getArticles(rootView);
    const articleid = [];

    articles.forEach(item => {
        const titleElement = item.querySelector('.col-title');
        const userElement = item.querySelector('.user-info');
        if(!titleElement || !userElement) return;
        const title = titleElement.innerText;
        const author = Parser.getUserID(userElement);
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
