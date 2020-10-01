import { defaultConfig } from '../module/Setting';

export default { apply };

function apply(commentArea) {
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
        if(!event.target.classList.contains('block-emoticon')) return;

        event.preventDefault();

        event.target.textContent = '뮤트 처리 중...';
        event.target.classList.remove('block-emoticon');
        const id = event.target.dataset.id;
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
