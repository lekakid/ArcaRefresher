import { defaultConfig } from './Setting';

export function apply(target) {
    const users = document.querySelectorAll('.content-wrapper .user-info');
    const memos = GM_getValue('userMemo', defaultConfig.userMemo);

    const memoElement = <span class="memo" />;

    users.forEach(user => {
        let id = user.getAttribute('data-id');
        if(id == null) {
            id = user.textContent.trim();
            const subid = user.querySelector('span[title]');
            id += subid ? (/#[0-9]+/.exec(subid.title) || '') : '';
            user.setAttribute('data-id', id);
        }

        if(target && id != target) return;

        let slot = user.querySelector('.memo');
        if(memos[id]) {
            if(slot == null) {
                slot = memoElement.cloneNode();
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

export function applyHandler() {
    const memoElement = <span class="memo" />;
    const memos = GM_getValue('userMemo', defaultConfig.userMemo);

    document.querySelector('.article-wrapper').addEventListener('click', event => {
        if(event.target.tagName != 'SPAN' && event.target.tagName != 'SMALL') return;
        if(!event.path[1].classList.contains('user-info')) return;

        const user = event.path[1];
        const id = user.getAttribute('data-id');
        let memo = memos[id];
        memo = prompt('이용자 메모를 설정합니다.\n', memo || '');
        if(memo == null) return;

        let slot = user.querySelector('.memo');
        if(slot == null) {
            slot = memoElement.cloneNode(true);
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
        apply(id);
    });
}
