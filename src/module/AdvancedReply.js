import * as DateManager from './DateManager';
import * as BlockSystem from './BlockSystem';
import { defaultConfig } from './Setting';
import * as IPScouter from './IPScouter';
import * as UserMemo from './UserMemo';

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
                    time.textContent = DateManager.getDateStr(time.dateTime);
                });
                const parent = document.querySelector('.article-comment');
                const list = parent.querySelector('.list-area');
                if(list) list.remove();
                parent.querySelector('.title').insertAdjacentElement('afterend', newComments);
                const items = newComments.querySelectorAll('.comment-item');
                UserMemo.apply();
                IPScouter.applyComments(items);
                BlockSystem.blockComment(items);
                BlockSystem.blockEmoticon(items);
                applyEmoticonBlockBtn();
            }
            resolve();
        });
        req.send();
    });
}

export function applyEmoticonBlockBtn() {
    const commentArea = document.querySelector('.article-comment');
    const emoticons = commentArea.querySelectorAll('.emoticon');

    emoticons.forEach(item => {
        const btn = (
            <span>
                {'\n | '}
                <a href="#" class="block-emoticon" data-id="">
                    <span class="ion-ios-close" />
                    {' 아카콘 차단'}
                </a>
            </span>
        );
        btn.querySelector('a').setAttribute('data-id', item.getAttribute('data-id'));

        const commentHeader = item.parentNode.parentNode;
        commentHeader.querySelector('time').insertAdjacentElement('afterend', btn);
    });

    async function onClick(event) {
        if(event.target.tagName != 'A') return;
        if(!event.target.classList.contains('block-emoticon')) return;

        event.preventDefault();

        event.target.textContent = '차단 중...';
        event.target.classList.remove('block-emoticon');
        const id = event.target.getAttribute('data-id');
        const [name, bundleID] = await getEmoticonInfo(id);
        const bundle = await getEmoticonBundle(bundleID);

        const blockEmoticon = GM_getValue('blockEmoticon', defaultConfig.blockEmoticon);
        blockEmoticon[bundleID] = { name, bundle };
        GM_setValue('blockEmoticon', blockEmoticon);
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
            if(element.classList.contains('btn-more')) return;
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
