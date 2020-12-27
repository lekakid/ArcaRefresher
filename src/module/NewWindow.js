import Configure from '../core/Configure';
import Parser from '../core/Parser';

export default { addSetting, apply };

const OPEN_NEW_WINDOW = { key: 'openNewWindow', defaultValue: false };

function addSetting() {
    const newWindow = (
        <select>
            <option value="false">사용 안 함</option>
            <option value="true">사용</option>
        </select>
    );
    Configure.addSetting({
        category: Configure.categoryKey.INTERFACE,
        header: '게시물 새 창으로 열기',
        option: newWindow,
        description: '게시물 클릭 시 새창으로 띄워줍니다.',
        callback: {
            save() {
                Configure.set(OPEN_NEW_WINDOW, newWindow.value == 'true');
            },
            load() {
                newWindow.value = Configure.get(OPEN_NEW_WINDOW);
            },
        },
    });
}

function apply() {
    const value = Configure.get(OPEN_NEW_WINDOW);
    if(!value) return;

    const articles = Parser.queryItems('articles', 'board');

    for(const article of articles) {
        article.setAttribute('target', '_blank');
    }
}
