import { defaultConfig } from './Setting';

export default { apply, setHandler };

function apply(rootView) {
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

function setHandler(rootView) {
    const memos = GM_getValue('userMemo', defaultConfig.userMemo);

    rootView.addEventListener('click', event => {
        if(event.target.tagName != 'SPAN' && event.target.tagName != 'SMALL') return;

        const user = event.target.closest('.user-info');
        if(user == null) return;

        const id = user.dataset.id;
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
        apply(rootView);
    });
}
