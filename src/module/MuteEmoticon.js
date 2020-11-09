import Setting from '../core/Setting';

export default { initialize, mute, apply };

const BLOCK_EMOTICON = 'blockEmoticon';
const BLOCK_EMOTICON_DEFAULT = {};

function initialize() {
    const configElement = (
        <>
            <label class="col-md-3">뮤트된 아카콘</label>
            <div class="col-md-9">
                <select size="6" multiple="" />
                <button name="delete" class="btn btn-success">삭제</button>
                <p>
                    아카콘 뮤트는 댓글에서 할 수 있습니다.<br />
                    Ctrl, Shift, 마우스 드래그를 이용해서 여러개를 동시에 선택 할 수 있습니다.
                </p>
            </div>
        </>
    );

    const selectElement = configElement.querySelector('select');
    const deleteBtn = configElement.querySelector('button[name="delete"]');
    deleteBtn.addEventListener('click', event => {
        event.target.disabled = true;

        const removeElements = selectElement.selectedOptions;
        while(removeElements.length > 0) removeElements[0].remove();

        event.target.disabled = false;
    });

    function load() {
        const data = GM_getValue(BLOCK_EMOTICON, BLOCK_EMOTICON_DEFAULT);

        for(const key of Object.keys(data)) {
            selectElement.append(<option value={key}>{data[key].name}</option>);
        }
    }
    function save() {
        const data = GM_getValue(BLOCK_EMOTICON, BLOCK_EMOTICON_DEFAULT);

        const keys = Array.from(selectElement.children, e => e.value);
        for(const key in data) {
            if(keys.indexOf(key) == -1) delete data[key];
        }
        GM_setValue(BLOCK_EMOTICON, data);
    }

    Setting.registConfig(configElement, 'muteConfig', save, load);
}

function mute(rootView) {
    const blockEmoticons = GM_getValue(BLOCK_EMOTICON, BLOCK_EMOTICON_DEFAULT);

    let list = [];
    for(const key in blockEmoticons) {
        if({}.hasOwnProperty.call(blockEmoticons, key)) {
            list = list.concat(blockEmoticons[key].bundle);
        }
    }

    const comments = rootView.querySelectorAll('.comment-item');
    comments.forEach(item => {
        const emoticon = item.querySelector('.emoticon');

        if(emoticon) {
            const id = emoticon.dataset.id;
            if(list.indexOf(id) > -1) {
                emoticon.closest('.message').innerText = '[아카콘 뮤트됨]';
            }
        }
    });
}

function apply(commentArea) {
    const emoticons = commentArea.querySelectorAll('.emoticon');

    emoticons.forEach(item => {
        const btn = (
            <span>
                {'\n | '}
                <a href="#" class="block-emoticon" data-id={item.dataset.id}>
                    <span class="ion-ios-close" />
                    {' 아카콘 뮤트'}
                </a>
            </span>
        );

        const timeElement = item.closest('.content').querySelector('.right > time');
        timeElement.insertAdjacentElement('afterend', btn);
    });

    commentArea.addEventListener('click', async event => {
        if(!event.target.classList.contains('block-emoticon')) return;

        event.preventDefault();

        event.target.textContent = '뮤트 처리 중...';
        event.target.classList.remove('block-emoticon');
        const id = event.target.dataset.id;
        const [name, bundleID] = await getEmoticonInfo(id);
        const bundle = await getEmoticonBundle(bundleID);

        const blockEmoticon = GM_getValue(BLOCK_EMOTICON, BLOCK_EMOTICON_DEFAULT);
        blockEmoticon[bundleID] = { name, bundle };
        GM_setValue(BLOCK_EMOTICON, blockEmoticon);
        location.reload();
    });
}

function getEmoticonInfo(id) {
    return new Promise((resolve) => {
        const req = new XMLHttpRequest();

        req.open('GET', `/api/emoticon/shop/${id}`);
        req.responseType = 'document';
        req.addEventListener('load', () => {
            const name = req.response.querySelector('.article-head .title').innerText;
            const bundleID = req.response.URL.split('/e/')[1];
            resolve([name, bundleID]);
        });
        req.send();
    });
}

function getEmoticonBundle(bundleID) {
    return new Promise((resolve) => {
        const req = new XMLHttpRequest();

        req.open('GET', `/api/emoticon/${bundleID}`);
        req.responseType = 'json';
        req.addEventListener('load', () => {
            const bundle = Object.keys(req.response);
            resolve(bundle);
        });
        req.send();
    });
}
