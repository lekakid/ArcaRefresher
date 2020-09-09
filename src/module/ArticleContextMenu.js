import { download } from './ImageDownloader';

import styles, { stylesheet } from '../css/ArticleContextMenu.module.css';

export function apply() {
    document.head.append(<style>{stylesheet}</style>);

    const wrapper = (
        <div class={`${styles.wrapper} hidden`}>
            <div class={styles.menu} id="context-menu" data-url="" data-html="" data-orig="">
                <a href="#" class={styles.item} id="copy-clipboard">이미지를 클립보드에 복사</a>
                <a href="#" class={styles.item} id="save">SAVE_SOMETHING</a>
                <a href="#" class={styles.item} id="copy-url">원본 주소 복사</a>
                <a href="#" class={styles.item} id="apply-myimage">자짤로 등록</a>
                <div id="search-wrapper">
                    <div class={styles.devider} />
                    <a href="" class={styles.item} id="search-google" target="_blank" rel="noreferrer">Google 검색</a>
                    <a href="" class={styles.item} id="search-yandex" target="_blank" rel="noreferrer" title="러시아 검색엔진입니다.">Yandex 검색</a>
                    <a href="#" class={styles.item} id="search-saucenao" target="_blank" title="망가, 픽시브 사이트 검색을 지원합니다.">SauceNao 검색</a>
                    <a href="#" class={styles.item} id="search-twigaten" target="_blank" title="트위터 이미지 검색을 지원합니다.">TwiGaTen 검색</a>
                    <a href="#" class={styles.item} id="search-ascii2d" target="_blank" title="트위터, 픽시브 사이트 검색을 지원합니다.">Ascii2D 검색</a>
                </div>
            </div>
        </div>
    );
    wrapper.addEventListener('contextmenu', event => {
        event.preventDefault();
    });
    wrapper.addEventListener('click', onClickContextMenu);
    document.querySelector('.root-container').append(wrapper);
    const context = wrapper.querySelector('#context-menu');

    function closeContext() {
        if(!wrapper.classList.contains('hidden')) wrapper.classList.add('hidden');
    }

    function onAnimationEnd() {
        if(wrapper.classList.contains('appear')) {
            wrapper.classList.remove('appear');
        }
    }
    wrapper.addEventListener('animationend', onAnimationEnd);

    document.addEventListener('click', closeContext);
    document.addEventListener('contextmenu', closeContext);
    document.addEventListener('scroll', closeContext);

    document.querySelector('.article-body').addEventListener('contextmenu', event => {
        if(event.target.tagName != 'IMG' && event.target.tagName != 'VIDEO') return;

        if(!wrapper.classList.contains(styles.mobile)) {
            context.setAttribute('style', `left: ${event.clientX + 2}px; top: ${event.clientY + 2}px`);
        }

        if(!wrapper.classList.contains('hidden')) {
            wrapper.classList.add('hidden');
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        wrapper.classList.remove('hidden');

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

        context.setAttribute('data-url', url);
        context.setAttribute('data-html', event.target.outerHTML);
        context.querySelector('#search-google').href = `https://www.google.com/searchbyimage?safe=off&image_url=${url}`;
        context.querySelector('#search-yandex').href = `https://yandex.com/images/search?rpt=imageview&url=${url}`;

        if(['gif', 'png', 'jpg', 'jpeg', 'wepb'].indexOf(type) > -1) {
            context.querySelector('#copy-clipboard').removeAttribute('style');
            context.querySelector('#save').innerText = '원본 이미지 저장';
            context.querySelector('#search-wrapper').removeAttribute('style');
        }
        else {
            context.querySelector('#copy-clipboard').setAttribute('style', 'display:none');
            context.querySelector('#save').innerText = '원본 비디오 저장';
            context.querySelector('#search-wrapper').setAttribute('style', 'display:none');
        }
    });
}

async function onClickContextMenu(event) {
    const context = document.querySelector('#context-menu');

    const originalText = event.target.textContent;

    if(event.target.id == 'copy-clipboard') {
        event.preventDefault();
        event.stopPropagation();

        const url = context.getAttribute('data-url');
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            responseType: 'arraybuffer',
            onprogress: e => {
                event.target.textContent = `다운로드 중...(${Math.round(e.loaded / e.total * 100)}%)`;
            },
            onload: response => {
                const buffer = response.response;
                const blob = new Blob([buffer], { type: 'image/png' });

                const item = new ClipboardItem({ [blob.type]: blob });
                navigator.clipboard.write([item]);
                context.parentNode.classList.add('hidden');
                event.target.textContent = originalText;
            },
        });
        return;
    }
    if(event.target.id == 'save') {
        event.preventDefault();
        event.stopPropagation();

        const url = context.getAttribute('data-url');
        const imgBlob = await download(url, event.target);
        window.saveAs(imgBlob, `image.${imgBlob.type.split('/')[1]}`);
        event.target.textContent = originalText;
    }
    if(event.target.id == 'copy-url') {
        event.preventDefault();

        const url = context.getAttribute('data-url');
        navigator.clipboard.writeText(url);
    }
    if(event.target.id == 'apply-myimage') {
        event.preventDefault();

        const html = context.getAttribute('data-html');
        GM_setValue('myImage', html);
        alert('선택한 짤이 등록되었습니다.\n새 게시물 작성 시 최상단에 자동으로 첨부됩니다.');
    }
    if(event.target.id.indexOf('search') > -1) {
        if(event.target.id == 'search-google') return;
        if(event.target.id == 'search-yandex') return;

        event.preventDefault();
        event.stopPropagation();

        const url = context.getAttribute('data-url');
        const db = event.target.id.split('-')[1];
        const promise = new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                responseType: 'blob',
                onprogress: e => {
                    event.target.textContent = `다운로드 중...(${Math.round(e.loaded / e.total * 100)}%)`;
                },
                onload: response => {
                    resolve(response.response);
                    event.target.textContent = '업로드 중...';
                },
            });
        });
        promise.then(blob => {
            const formdata = new FormData();
            formdata.append('file', blob, `image.${blob.type.split('/')[1]}`);
            if(db == 'saucenao') {
                formdata.append('frame', 1);
                formdata.append('database', 999);
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://saucenao.com/search.php',
                    responseType: 'document',
                    data: formdata,
                    onload: response => {
                        const tag = response.response.querySelector('#yourimage a');
                        if(tag) {
                            const replaceURL = response.response.querySelector('#yourimage a').href.split('image=')[1];
                            window.open(`https://saucenao.com/search.php?db=999&url=https://saucenao.com/userdata/tmp/${replaceURL}`);
                        }
                        else {
                            alert('비로그인 이용자 검색 제한을 초과했습니다.');
                        }
                        context.parentNode.classList.add('hidden');
                        event.target.textContent = originalText;
                    },
                });
            }
            else if(db == 'ascii2d') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://ascii2d.net',
                    responseType: 'document',
                    data: formdata,
                    onload: r => {
                        const token = r.response.querySelector('input[name="authenticity_token"]').value;

                        formdata.append('utf8', '✓');
                        formdata.append('authenticity_token', token);
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: 'https://ascii2d.net/search/file',
                            responseType: 'document',
                            data: formdata,
                            onload: res => {
                                window.open(res.finalUrl);
                                context.parentNode.classList.add('hidden');
                                event.target.textContent = originalText;
                            },
                        });
                    },
                });
            }
            else if(db == 'twigaten') {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://twigaten.204504byse.info/search/media',
                    responseType: 'document',
                    data: formdata,
                    onload: res => {
                        window.open(res.finalUrl);
                        context.parentNode.classList.add('hidden');
                        event.target.textContent = originalText;
                    },
                });
            }
        });
    }
}
