import * as Setting from './Setting';

export function apply() {
    const users = document.querySelectorAll('.content-wrapper .user-info');
    const memos = window.config.userMemo;

    const memoElement = <span class="memo"> - MEMO</span>;

    users.forEach(user => {
        if(user.getAttribute('data-id')) return;

        let id = user.textContent.trim();
        const subid = user.querySelector('span[title]');
        id += subid ? (/#[0-9]+/.exec(subid.title) || '') : '';
        const slot = memoElement.cloneNode();

        user.setAttribute('data-id', id);

        if(memos[id]) {
            slot.innerText = ` - ${memos[id]}`;
            user.append(slot);
            user.title = memos[id];
        }
    });
}

export function applyArticle() {
    const memoElement = <span class="memo"> - MEMO</span>;
    const memos = window.config.userMemo;

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
            slot.innerText = ` - ${memo}`;
            memos[id] = memo;
        }
        else {
            slot.remove();
            delete memos[id];
        }

        Setting.save(window.config);
    });
}
