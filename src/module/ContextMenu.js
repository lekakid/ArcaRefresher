import { getBlob as download } from '../util/DownloadManager';

import contextsheet from '../css/ContextMenu.css';

export default { apply };

function apply(rootView) {
    const articleBody = rootView.querySelector('.article-body');
    if(articleBody == null) return;

    document.head.append(<style>{contextsheet}</style>);

    const contextMenu = (
        <div class="menu hidden" id="context-menu" data-url="" data-html="" data-orig="">
            <a href="#" class="item" id="copy-clipboard">이미지를 클립보드에 복사</a>
            <a href="#" class="item" id="save">SAVE_SOMETHING</a>
            <a href="#" class="item" id="copy-url">원본 주소 복사</a>
            <a href="#" class="item" id="apply-myimage">자짤로 등록</a>
            <div id="search-wrapper">
                <div class="devider" />
                <a href="" class="item" id="search-google" target="_blank" rel="noreferrer">Google 검색</a>
                <a href="" class="item" id="search-yandex" target="_blank" rel="noreferrer" title="러시아 검색엔진입니다.">Yandex 검색</a>
                <a href="#" class="item" id="search-saucenao" target="_blank" title="망가, 픽시브 사이트 검색을 지원합니다.">SauceNao 검색</a>
                <a href="#" class="item" id="search-twigaten" target="_blank" title="트위터 이미지 검색을 지원합니다.">TwiGaTen 검색</a>
                <a href="#" class="item" id="search-ascii2d" target="_blank" title="트위터, 픽시브 사이트 검색을 지원합니다.">Ascii2D 검색</a>
            </div>
        </div>
    );
    contextMenu.addEventListener('contextmenu', event => {
        event.preventDefault();
    });
    contextMenu.addEventListener('click', onClickContextMenu);
    rootView.append(contextMenu);

    contextMenu.addEventListener('animationend', () => {
        if(contextMenu.classList.contains('appear')) {
            contextMenu.classList.remove('appear');
        }
    });

    function closeContext() {
        if(!contextMenu.classList.contains('hidden')) contextMenu.classList.add('hidden');
    }

    document.addEventListener('click', closeContext);
    document.addEventListener('contextmenu', closeContext);
    document.addEventListener('scroll', closeContext);

    articleBody.addEventListener('contextmenu', event => {
        if(event.target.tagName != 'IMG' && event.target.tagName != 'VIDEO') return;

        contextMenu.setAttribute('style', `left: ${event.clientX + 2}px; top: ${event.clientY + 2}px`);

        if(!contextMenu.classList.contains('hidden')) {
            contextMenu.classList.add('hidden');
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        contextMenu.classList.remove('hidden');

        let url = event.target.src;
        let type;
        if(event.target.getAttribute('data-orig')) {
            url = `${url}.${event.target.getAttribute('data-orig')}?type=orig`;
            type = event.target.getAttribute('data-orig');
        }
        else {
            url = `${url}?type=orig`;
            type = event.target.src.replace(/.*\.arca\.live\/.*\/.*\./, '');
        }

        contextMenu.dataset.url = url;
        contextMenu.dataset.html = event.target.outerHTML;
        contextMenu.querySelector('#search-google').href = `https://www.google.com/searchbyimage?safe=off&image_url=${url}`;
        contextMenu.querySelector('#search-yandex').href = `https://yandex.com/images/search?rpt=imageview&url=${url}`;

        if(['gif', 'png', 'jpg', 'jpeg', 'wepb'].indexOf(type) > -1) {
            contextMenu.querySelector('#copy-clipboard').removeAttribute('style');
            contextMenu.querySelector('#save').innerText = '원본 이미지 저장';
            contextMenu.querySelector('#search-wrapper').removeAttribute('style');
        }
        else {
            contextMenu.querySelector('#copy-clipboard').setAttribute('style', 'display:none');
            contextMenu.querySelector('#save').innerText = '원본 비디오 저장';
            contextMenu.querySelector('#search-wrapper').setAttribute('style', 'display:none');
        }
    });
}

async function onClickContextMenu(event) {
    const context = document.querySelector('#context-menu');

    const originalText = event.target.textContent;
    const url = context.dataset.url;

    if(event.target.id == 'copy-clipboard') {
        event.preventDefault();
        event.stopPropagation();

        GM_xmlhttpRequest({
            method: 'GET',
            url,
            responseType: 'arraybuffer',
            onprogress: e => {
                event.target.textContent = `${Math.round(e.loaded / e.total * 100)}%`;
            },
            onload: response => {
                const buffer = response.response;
                const blob = new Blob([buffer], { type: 'image/png' });

                const item = new ClipboardItem({ [blob.type]: blob });
                navigator.clipboard.write([item]);
                context.classList.add('hidden');
                event.target.textContent = originalText;
            },
        });
        return;
    }
    if(event.target.id == 'save') {
        event.preventDefault();
        event.stopPropagation();

        const imgBlob = await download(url,
            e => {
                const progress = Math.round(e.loaded / e.total * 100);
                event.target.textContent = `${progress}%`;
            },
            () => {
                event.target.textContent = originalText;
            });
        window.saveAs(imgBlob, `image.${imgBlob.type.split('/')[1]}`);
        context.classList.add('hidden');
    }
    if(event.target.id == 'copy-url') {
        event.preventDefault();

        navigator.clipboard.writeText(url);
    }
    if(event.target.id == 'apply-myimage') {
        event.preventDefault();

        const html = context.dataset.html;
        GM_setValue('myImage', html);
        alert('선택한 짤이 등록되었습니다.\n새 게시물 작성 시 최상단에 자동으로 첨부됩니다.');
    }
    if(event.target.id.indexOf('search') > -1) {
        if(event.target.id == 'search-google') return;
        if(event.target.id == 'search-yandex') return;

        event.preventDefault();
        event.stopPropagation();

        const img = context.getAttribute('data-url');
        const db = event.target.id.split('-')[1];

        try {
            const imgBlob = await download(img,
                e => {
                    const progress = Math.round(e.loaded / e.total * 100);
                    event.target.textContent = `${progress}%`;
                },
                () => {
                    event.target.textContent = '업로드 중...';
                });

            const docParser = new DOMParser();

            let searchEngineURL = '';
            const formdata = new FormData();
            formdata.append('file', imgBlob, `image.${imgBlob.type.split('/')[1]}`);

            if(db == 'saucenao') {
                formdata.append('frame', 1);
                formdata.append('database', 999);
                searchEngineURL = 'https://saucenao.com/search.php';
            }
            else if(db == 'ascii2d') {
                const tokenDocument = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: 'https://ascii2d.net',
                        data: formdata,
                        onload: response => {
                            resolve(docParser.parseFromString(response.responseText, 'text/html'));
                        },
                        onerror: () => {
                            reject(new Error('Access Rejected'));
                        },
                    });
                });
                const token = tokenDocument.querySelector('input[name="authenticity_token"]').value;
                formdata.append('utf8', '✓');
                formdata.append('authenticity_token', token);
                searchEngineURL = 'https://ascii2d.net/search/file';
            }
            else if(db == 'twigaten') {
                searchEngineURL = 'https://twigaten.204504byse.info/search/media';
            }

            const result = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: searchEngineURL,
                    data: formdata,
                    onload: resolve,
                    onerror: () => {
                        reject(new Error('Access Rejected'));
                    },
                });
            });

            if(db == 'saucenao') {
                const resultDocument = docParser.parseFromString(result.responseText, 'text/html');
                const replaceURL = resultDocument.querySelector('#yourimage a').href.split('image=')[1];
                window.open(`https://saucenao.com/search.php?db=999&url=https://saucenao.com/userdata/tmp/${replaceURL}`);
            }
            else if(db == 'ascii2d') {
                window.open(result.finalUrl);
            }
            else if(db == 'twigaten') {
                window.open(result.finalUrl);
            }
        }
        catch(error) {
            alert('업로드 중 발생했습니다.\n개발자 도구(F12)의 콘솔(Console) 탭을 캡처해서 문의바랍니다.');
            console.error(error);
        }
        finally {
            context.classList.add('hidden');
            event.target.textContent = originalText;
        }
    }
}
