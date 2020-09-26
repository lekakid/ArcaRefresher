import { defaultConfig } from './Setting';

export function parseUserInfo(rootView) {
    const users = rootView.querySelectorAll('.user-info');

    users.forEach(user => {
        let id = user.dataset.id;
        if(id == undefined) {
            id = user.innerText.trim();
            const subid = user.querySelector('a[title], span[title]');
            if(subid && subid.title.indexOf('#') > -1) {
                id = subid.title.substring(subid.title.indexOf('#'));
            }
            user.dataset.id = id;
        }
    });
}

export function applyMemo(rootView) {
    const users = rootView.querySelectorAll('.user-info');
    const memos = GM_getValue('userMemo', defaultConfig.userMemo);

    users.forEach(user => {
        const id = user.dataset.id;

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
}

export function setHandler(rootView) {
    const memos = GM_getValue('userMemo', defaultConfig.userMemo);

    rootView.addEventListener('click', event => {
        if(event.target.tagName != 'SPAN' && event.target.tagName != 'SMALL') return;

        const user = event.target.closest('.user-info');
        if(user == null) return;

        const id = user.dataset.id;
        let memo = memos[id];
        memo = prompt('이용자 메모를 설정합니다.\n', memo || '');
        if(memo == null) return;

        let slot = user.querySelector('.memo');
        if(slot == null) {
            slot = <span class="memo" />;
            user.append(slot);
        }

        if(memo) {
            slot.textContent = ` - ${memo}`;
            memos[id] = memo;
        }
        else {
            slot.remove();
            delete memos[id];
        }

        GM_setValue('userMemo', memos);
        applyMemo(rootView);
    });
}
