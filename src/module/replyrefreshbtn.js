import * as DateManager from './datemanager.js';

export function apply() {
    const btn = 
        <span>
            <span>　</span>
            <button class="btn btn-success">
                <span class="icon ion-android-refresh"></span>
                <span> 새로고침</span>
            </button>
        </span>;
    const clonebtn = btn.cloneNode(true);

    document.querySelector('.article-comment .title a').insertAdjacentElement('beforebegin', btn);
    document.querySelector('.article-comment .subtitle').append(clonebtn);

    async function onclick(event) {
        event.preventDefault();
        btn.disabled = true;
        clonebtn.disabled = true;
        await refresh();
        btn.disabled = false;
        clonebtn.disabled = false;
    }

    btn.addEventListener('click', onclick);
    clonebtn.addEventListener('click', onclick);
}

function refresh() {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();

        req.open('GET', window.location.href);
        req.responseType = 'document';
        req.addEventListener('load', event => {
            const newComments = req.response.querySelector('.article-comment .list-area');
            newComments.querySelectorAll('time').forEach(time => {
                time.innerText = DateManager.getDateStr(time.dateTime);
            });
            if(newComments) {
                const parent = document.querySelector('.article-comment');
                const list = parent.querySelector('.list-area');
                if(list) list.remove();
                parent.querySelector('.title').insertAdjacentElement('afterend', newComments);
            }
            resolve();
        });
        req.send();
    });
}