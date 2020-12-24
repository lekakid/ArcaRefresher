import Configure from '../core/Configure';
import Parser from '../core/Parser';

export default { addSetting, apply };

const OPEN_NEW_WINDOW = 'openNewWindow';
const OPEN_NEW_WINDOW_DEFAULT = false;

function addSetting() {
    const selectElement = (
        <select>
            <option value="false">사용 안 함</option>
            <option value="true">사용</option>
        </select>
    );

    const settingElement = (
        <>
            <label class="col-md-3">게시물 새 창으로 열기</label>
            <div class="col-md-9">
                {selectElement}
                <p>게시물 클릭 시 새창으로 띄워줍니다.</p>
            </div>
        </>
    );

    function load() {
        const value = GM_getValue(OPEN_NEW_WINDOW, OPEN_NEW_WINDOW_DEFAULT);

        selectElement.value = value;
    }
    function save() {
        GM_setValue(OPEN_NEW_WINDOW, selectElement.value == 'true');
    }

    Configure.addSetting(settingElement, Configure.categoryKey.INTERFACE, save, load);
}

function apply() {
    const value = GM_getValue(OPEN_NEW_WINDOW, OPEN_NEW_WINDOW_DEFAULT);
    if(!value) return;

    const articles = Parser.queryItems('articles', 'board');

    for(const article of articles) {
        article.setAttribute('target', '_blank');
    }
}
