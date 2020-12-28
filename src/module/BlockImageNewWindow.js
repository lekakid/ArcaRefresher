import Configure from '../core/Configure';
import Parser from '../core/Parser';

export default { load };

const BLOCK_IMAGE_NEW_WINDOW = { key: 'blockImageNewWindow', defaultValue: false };

function load() {
    try {
        addSetting();

        if(Parser.hasArticle()) {
            apply();
        }
    }
    catch(error) {
        console.error(error);
    }
}

function addSetting() {
    const setting = (
        <select>
            <option value="false">사용 안 함</option>
            <option value="true">사용</option>
        </select>
    );
    Configure.addSetting({
        category: Configure.categoryKey.INTERFACE,
        header: '컨텐츠 원본보기 방지',
        option: setting,
        description: '게시물 조회 시 이미지 등을 클릭하면 원본 이미지가 열리는 기능을 막습니다.',
        callback: {
            save() {
                Configure.set(BLOCK_IMAGE_NEW_WINDOW, setting.value == 'true');
            },
            load() {
                setting.value = Configure.get(BLOCK_IMAGE_NEW_WINDOW);
            },
        },
    });
}

function apply() {
    if(!Configure.get(BLOCK_IMAGE_NEW_WINDOW)) return;

    const targetElements = document.querySelectorAll('.article-body img, .article-body video:not([controls])');

    for(const element of targetElements) {
        const a = <a />;

        element.insertAdjacentElement('beforebegin', a);
        a.append(element);
    }
}
