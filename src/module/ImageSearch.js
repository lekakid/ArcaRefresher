import ContextMenu from '../core/ContextMenu';
import { getBlob } from '../util/DownloadManager';

export default { addContextMenu };

function addContextMenu() {
    const searchGoogleItem = ContextMenu.createContextMenuItem('Google 검색');
    searchGoogleItem.addEventListener('click', event => {
        event.preventDefault();

        const url = ContextMenu.getContextData('url');
        window.open(`https://www.google.com/searchbyimage?safe=off&image_url=${url}`);
        ContextMenu.hideContextMenu();
    });
    const searchYandexItem = ContextMenu.createContextMenuItem('Yandex 검색', '러시아 검색엔진입니다.');
    searchYandexItem.addEventListener('click', event => {
        event.preventDefault();

        const url = ContextMenu.getContextData('url');
        window.open(`https://yandex.com/images/search?rpt=imageview&url=${url}`);
        ContextMenu.hideContextMenu();
    });
    const searchSauceNaoItem = ContextMenu.createContextMenuItem('SauceNao 검색', '망가, 픽시브 이미지 검색을 지원합니다.');
    searchSauceNaoItem.addEventListener('click', async event => {
        event.preventDefault();

        const url = ContextMenu.getContextData('url');
        const blob = await getBlob(url,
            e => {
                const progress = Math.round(e.loaded / e.total * 100);
                event.target.textContent = `${progress}%`;
            },
            () => {
                event.target.textContent = '업로드 중...';
            });

        const docParser = new DOMParser();
        const formdata = new FormData();
        formdata.append('file', blob, `image.${blob.type.split('/')[1]}`);
        formdata.append('frame', 1);
        formdata.append('database', 999);

        const result = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://saucenao.com/search.php',
                data: formdata,
                onload: resolve,
                onerror: () => {
                    reject(new Error('Access Rejected'));
                },
            });
        });

        const resultDocument = docParser.parseFromString(result.responseText, 'text/html');
        const replaceURL = resultDocument.querySelector('#yourimage a').href.split('image=')[1];
        window.open(`https://saucenao.com/search.php?db=999&url=https://saucenao.com/userdata/tmp/${replaceURL}`);
        ContextMenu.hideContextMenu();
    });
    const searchTwigatenItem = ContextMenu.createContextMenuItem('TwitGaTen 검색', '트위터 이미지 검색을 지원합니다.');
    searchTwigatenItem.addEventListener('click', async event => {
        event.preventDefault();

        const url = ContextMenu.getContextData('url');
        const blob = await getBlob(url,
            e => {
                const progress = Math.round(e.loaded / e.total * 100);
                event.target.textContent = `${progress}%`;
            },
            () => {
                event.target.textContent = '업로드 중...';
            });

        const formdata = new FormData();
        formdata.append('file', blob, `image.${blob.type.split('/')[1]}`);

        const result = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://twigaten.204504byse.info/search/media',
                data: formdata,
                onload: resolve,
                onerror: () => {
                    reject(new Error('Access Rejected'));
                },
            });
        });

        window.open(result.finalUrl);
        ContextMenu.hideContextMenu();
    });
    const searchAscii2dItem = ContextMenu.createContextMenuItem('Ascii2D 검색', '트위터, 픽시브 이미지 검색을 지원합니다.');
    searchAscii2dItem.addEventListener('click', async event => {
        event.preventDefault();

        const url = ContextMenu.getContextData('url');
        const blob = await getBlob(url,
            e => {
                const progress = Math.round(e.loaded / e.total * 100);
                event.target.textContent = `${progress}%`;
            },
            () => {
                event.target.textContent = '업로드 중...';
            });

        const docParser = new DOMParser();
        const tokenDocument = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://ascii2d.net',
                onload: response => {
                    resolve(docParser.parseFromString(response.responseText, 'text/html'));
                },
                onerror: () => {
                    reject(new Error('Access Rejected'));
                },
            });
        });
        const token = tokenDocument.querySelector('input[name="authenticity_token"]').value;

        const formdata = new FormData();
        formdata.append('file', blob, `image.${blob.type.split('/')[1]}`);
        formdata.append('utf8', '✓');
        formdata.append('authenticity_token', token);

        const result = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://ascii2d.net/search/file',
                data: formdata,
                onload: resolve,
                onerror: () => {
                    reject(new Error('Access Rejected'));
                },
            });
        });

        window.open(result.finalUrl);
        ContextMenu.hideContextMenu();
    });

    const contextElement = (
        <div>
            {searchGoogleItem}
            {searchYandexItem}
            {searchSauceNaoItem}
            {searchTwigatenItem}
            {searchAscii2dItem}
        </div>
    );

    ContextMenu.registContextMenu('clickOnImage', contextElement);
}
