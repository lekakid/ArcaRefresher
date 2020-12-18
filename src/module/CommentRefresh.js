import Parser from '../core/Parser';
import { getDateStr } from '../util/DateManager';

export default { apply };

function apply() {
    const commentArea = Parser.queryView('comment');
    if(commentArea && commentArea.querySelector('.alert')) {
        // 댓글 작성 권한 없음
        return;
    }

    const btn = (
        <button class="btn btn-arca" style="margin-left: 1rem">
            <span class="icon ion-android-refresh" />
            <span> 새로고침</span>
        </button>
    );
    const clonebtn = btn.cloneNode(true);

    commentArea.querySelector('.title a').insertAdjacentElement('beforebegin', btn);
    commentArea.querySelector('.subtitle').append(clonebtn);

    async function onClick(event) {
        event.preventDefault();
        btn.disabled = true;
        clonebtn.disabled = true;

        const response = await getRefreshData();
        const newComments = response.querySelector('#comment .list-area');
        try {
            commentArea.querySelector('.list-area').remove();
        }
        // eslint-disable-next-line no-empty
        catch {}

        if(newComments) {
            newComments.querySelectorAll('time').forEach(time => {
                time.textContent = getDateStr(time.dateTime);
            });
            commentArea.querySelector('.title').insertAdjacentElement('afterend', newComments);
            commentArea.dispatchEvent(new CustomEvent('ar_refresh'));
        }

        btn.disabled = false;
        clonebtn.disabled = false;
    }

    btn.addEventListener('click', onClick);
    clonebtn.addEventListener('click', onClick);
}

function getRefreshData() {
    return new Promise((resolve) => {
        const req = new XMLHttpRequest();

        req.open('GET', window.location.href);
        req.responseType = 'document';
        req.addEventListener('load', () => {
            resolve(req.response);
        });
        req.send();
    });
}
