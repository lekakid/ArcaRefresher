import Configure from '../core/Configure';
import ContextMenu from '../core/ContextMenu';

export default { addSetting, addContextMenu, apply };

const MY_IMAGES = 'myImages';
const MY_IMAGES_DEFAULT = {};

function addSetting(channel) {
    const settingElement = (
        <>
            <label class="col-md-3">자짤 관리</label>
            <div class="col-md-9">
                <select size="6" multiple="" />
                <button name="delete" class="btn btn-success">삭제</button>
                <p>
                    Ctrl, Shift, 마우스 드래그를 이용해서 여러개를 동시에 선택 할 수 있습니다.
                </p>
            </div>
        </>
    );

    const selectElement = settingElement.querySelector('select');
    const deleteBtn = settingElement.querySelector('button[name="delete"]');
    deleteBtn.addEventListener('click', event => {
        event.target.disabled = true;

        const removeElements = selectElement.selectedOptions;
        while(removeElements.length > 0) removeElements[0].remove();

        event.target.disabled = false;
    });

    function load() {
        const data = GM_getValue(MY_IMAGES, MY_IMAGES_DEFAULT)[channel];
        if(!data) return;

        for(const i of data) {
            selectElement.append(<option value={i}>{i}</option>);
        }
    }
    function save() {
        const data = GM_getValue(MY_IMAGES, MY_IMAGES_DEFAULT);
        if(!data[channel]) {
            data[channel] = [];
        }

        const images = Array.from(selectElement.children, e => e.value);
        data[channel] = images;
        GM_setValue(MY_IMAGES, data);
    }

    Configure.addSetting(settingElement, Configure.categoryKey.UTILITY, save, load);
}

function addContextMenu() {
    const addMyImageItem = ContextMenu.createContextMenuItem('자짤로 등록');
    addMyImageItem.addEventListener('click', event => {
        event.preventDefault();

        const imgList = GM_getValue(MY_IMAGES, MY_IMAGES_DEFAULT);
        if(!imgList[channel]) {
            imgList[channel] = [];
        }
        imgList[channel].push(ContextMenu.getContextData('url'));
        GM_setValue(MY_IMAGES, imgList);
        ContextMenu.hideContextMenu();
    });

    const contextElement = (
        <div>
            {addMyImageItem}
        </div>
    );

    ContextMenu.registContextMenu('clickOnImage', contextElement);
}

function apply(editor, channel) {
    if(editor.core.isEmpty()) {
        const imgList = GM_getValue(MY_IMAGES, MY_IMAGES_DEFAULT)[channel];
        if(!imgList || !imgList.length) return;

        const img = imgList[Math.floor(Math.random() * imgList.length)];
        editor.html.set(`<img src="${img}">`);
        editor.html.insert('<p></p>');
        editor.selection.setAtEnd(editor.$el.get(0));
    }
}
