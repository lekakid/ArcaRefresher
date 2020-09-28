import * as DateManager from '../util/DateManager';
import { defaultConfig } from './Setting';

export function applyRefreshBtn(commentArea) {
    if(commentArea.querySelector('.alert')) {
        // 댓글 작성 권한 없음
        return;
    }

    const btn = (
        <button class="btn btn-success" style="margin-left: 1rem">
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
        const newComments = response.querySelector('.article-comment .list-area');
        try {
            commentArea.querySelector('.list-area').remove();
        }
        // eslint-disable-next-line no-empty
        catch {}

        if(newComments) {
            newComments.querySelectorAll('time').forEach(time => {
                time.textContent = DateManager.getDateStr(time.dateTime);
            });
            commentArea.querySelector('.title').insertAdjacentElement('afterend', newComments);
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

export function applyEmoticonBlockBtn(commentArea) {
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
        if(event.target.tagName != 'A') return;
        if(!event.target.classList.contains('block-emoticon')) return;

        event.preventDefault();

        event.target.textContent = '뮤트 처리 중...';
        event.target.classList.remove('block-emoticon');
        const id = event.target.getAttribute('data-id');
        const [name, bundleID] = await getEmoticonInfo(id);
        const bundle = await getEmoticonBundle(bundleID);

        const blockEmoticon = GM_getValue('blockEmoticon', defaultConfig.blockEmoticon);
        blockEmoticon[bundleID] = { name, bundle };
        GM_setValue('blockEmoticon', blockEmoticon);
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

export function applyFullAreaRereply(commentArea) {
    commentArea.addEventListener('click', event => {
        const checkWriteForm = event.target.closest('form');
        if(checkWriteForm) return;

        const element = event.target.closest('a, .emoticon, .btn-more, .message');
        if(element == null) return;
        if(!element.classList.contains('message')) return;

        event.preventDefault();

        element.parentNode.querySelector('.reply-link').click();
    });
}
