import * as DateManager from './DateManager';
import * as BlockSystem from './BlockSystem';
import * as Setting from './Setting';

export function applyRefreshBtn() {
    const btn = (
        <span>
            <span>　</span>
            <button class="btn btn-success">
                <span class="icon ion-android-refresh" />
                <span> 새로고침</span>
            </button>
        </span>
    );
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
    return new Promise((resolve) => {
        const req = new XMLHttpRequest();

        req.open('GET', window.location.href);
        req.responseType = 'document';
        req.addEventListener('load', () => {
            const newComments = req.response.querySelector('.article-comment .list-area');
            if(newComments) {
                newComments.querySelectorAll('time').forEach(time => {
                    time.innerText = DateManager.getDateStr(time.dateTime);
                });
                const parent = document.querySelector('.article-comment');
                const list = parent.querySelector('.list-area');
                if(list) list.remove();
                parent.querySelector('.title').insertAdjacentElement('afterend', newComments);
                const items = newComments.querySelectorAll('.comment-item');
                BlockSystem.blockComment(items);
                BlockSystem.blockEmoticon(items);
                applyBlockBtn();
            }
            resolve();
        });
        req.send();
    });
}

export function applyBlockBtn() {
    const emoticons = document.querySelectorAll('.comment-item img, .comment-item video');

    emoticons.forEach(item => {
        const btn = <button class="btn btn-success block-emoticon" data-id="">차단</button>;

        btn.setAttribute('data-id', item.getAttribute('data-id'));
        item.parentNode.append(btn);
    });

    async function onClick(event) {
        if(event.target.tagName != 'BUTTON') return;
        if(!event.target.classList.contains('block-emoticon')) return;

        event.preventDefault();

        event.target.innerText = '차단 중...';
        event.target.disabled = true;
        const id = event.target.getAttribute('data-id');
        const [name, bundleID] = await getEmoticonInfo(id);
        const bundle = await getEmoticonBundle(bundleID);

        window.config.blockEmoticon[bundleID] = { name, bundle };
        Setting.save(window.config);
        location.reload();
    }

    document.querySelector('.article-comment').addEventListener('click', onClick);
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

export function applyFullAreaRereply() {
    function onClick(event) {
        switch(event.target.tagName) {
        case 'IMG':
        case 'VIDEO':
        case 'A':
        case 'BUTTON':
        case 'TEXTAREA':
            return;
        default:
            break;
        }

        for(let i = 0; i < 5; i += 1) {
            const element = event.path[i];
            if(element.classList.contains('reply-form')) return;
        }

        for(let i = 0; i < 5; i += 1) {
            const element = event.path[i];
            if(element.classList.contains('message')) {
                event.preventDefault();

                element.parentNode.querySelector('.reply-link').click();
                return;
            }
        }
    }

    document.querySelector('.article-comment').addEventListener('click', onClick);
}
