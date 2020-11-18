import Configure from '../core/Configure';
import Parser from '../core/Parser';

export default { addSetting, apply };

const USER_MEMO = 'userMemo';
const USER_MEMO_DEFAULT = {};

let handlerApplied = false;

function addSetting() {
    const settingElement = (
        <>
            <label class="col-md-3">메모된 이용자</label>
            <div class="col-md-9">
                <select size="6" multiple="" />
                <button name="delete" class="btn btn-success">삭제</button>
                <p>
                    메모는 게시물 작성자, 댓글 작성자 아이콘(IP)을 클릭해 할 수 있습니다.<br />
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
        const data = GM_getValue(USER_MEMO, USER_MEMO_DEFAULT);
        while(selectElement.childElementCount) {
            selectElement.removeChild(selectElement.children[0]);
        }

        for(const key of Object.keys(data)) {
            selectElement.append(<option value={key}>{`${key}-${data[key]}`}</option>);
        }
    }
    function save() {
        const data = GM_getValue(USER_MEMO, USER_MEMO_DEFAULT);

        const keys = Array.from(selectElement.children, e => e.value);
        for(const key in data) {
            if(keys.indexOf(key) == -1) delete data[key];
        }
        GM_setValue(USER_MEMO, data);
    }

    Configure.addSetting(settingElement, Configure.categoryKey.MEMO, save, load);
}

function apply() {
    const users = Parser.queryItems('users');
    const memos = GM_getValue(USER_MEMO, USER_MEMO_DEFAULT);

    users.forEach(user => {
        const id = Parser.parseUserID(user);

        let slot = user.querySelector('.memo');
        if(memos[id]) {
            if(slot == null) {
                slot = <span class="memo" />;
                user.append(slot);
            }
            slot.textContent = ` - ${memos[id]}`;
            user.title = memos[id];
        }
        else if(slot) {
            slot.remove();
            user.title = '';
        }
    });

    const articleView = Parser.queryView('article');
    if(!articleView || handlerApplied) return;

    handlerApplied = true;
    articleView.addEventListener('click', event => {
        if(event.target.closest('a')) return;

        const user = event.target.closest('.user-info');
        if(user == null) return;

        event.preventDefault();

        const id = Parser.parseUserID(user);
        const newMemo = prompt('이용자 메모를 설정합니다.\n', memos[id] || '');
        if(newMemo == null) return;

        let slot = user.querySelector('.memo');
        if(slot == null) {
            slot = <span class="memo" />;
            user.append(slot);
        }

        if(newMemo) {
            slot.textContent = ` - ${newMemo}`;
            memos[id] = newMemo;
        }
        else {
            slot.remove();
            delete memos[id];
        }

        GM_setValue('userMemo', memos);
        apply();
    });
}
