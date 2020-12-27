import Configure from '../core/Configure';
import ContextMenu from '../core/ContextMenu';
import Parser from '../core/Parser';

export default { addSetting, addContextMenu, apply };

const MY_IMAGES = { key: 'myImages', defaultValue: {} };

function addSetting() {
    const imgList = <select size="6" multiple="" />;
    const deleteBtn = <button class="btn btn-arca">삭제</button>;
    deleteBtn.addEventListener('click', event => {
        event.target.disabled = true;

        const removeElements = imgList.selectedOptions;
        while(removeElements.length > 0) removeElements[0].remove();

        event.target.disabled = false;
    });
    const channel = Parser.getChannelInfo().id;
    Configure.addSetting({
        category: Configure.categoryKey.UTILITY,
        header: '자짤 관리',
        option: (
            <>
                {imgList}
                {deleteBtn}
            </>
        ),
        description: 'Ctrl, Shift, 마우스 드래그를 이용해서 여러개를 동시에 선택 할 수 있습니다.',
        callback: {
            save() {
                const data = Configure.get(MY_IMAGES);

                const images = Array.from(imgList.children, e => e.value);
                data[channel] = images;
                Configure.set(MY_IMAGES, data);
            },
            load() {
                const data = Configure.get(MY_IMAGES)[channel];
                if(!data) return;

                for(const i of data) {
                    imgList.append(<option value={i}>{i}</option>);
                }
            },
        },
    });
}

function addContextMenu() {
    const channel = Parser.getChannelInfo().id;
    const addMyImageItem = ContextMenu.createContextMenuItem('자짤로 등록');
    addMyImageItem.addEventListener('click', event => {
        event.preventDefault();

        const imgList = Configure.get(MY_IMAGES);
        if(!imgList[channel]) {
            imgList[channel] = [];
        }
        imgList[channel].push(ContextMenu.getContextData('url').split('?')[0]);
        Configure.set(MY_IMAGES, imgList);
        ContextMenu.hideContextMenu();
    });

    const contextElement = (
        <div>
            {addMyImageItem}
        </div>
    );

    ContextMenu.registContextMenu('clickOnImage', contextElement);
}

function apply(editor) {
    const channel = Parser.getChannelInfo().id;
    if(editor.core.isEmpty()) {
        const imgList = Configure.get(MY_IMAGES)[channel];
        if(!imgList || !imgList.length) return;

        const img = imgList[Math.floor(Math.random() * imgList.length)];
        editor.html.set(`<img src="${img}">`);
        editor.html.insert('<p></p>');
        editor.selection.setAtEnd(editor.$el.get(0));
    }
}
