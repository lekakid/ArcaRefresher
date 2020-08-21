import * as Setting from './Setting';

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
                    <a href="" class={styles.item} id="search-google" target="_blank" rel="noreferrer">구글 검색</a>
                    <a href="" class={styles.item} id="search-yandex" target="_blank" rel="noreferrer" title="러시아 검색엔진입니다.">Yandex 검색</a>
                    <a href="" class={styles.item} id="search-iqdb" target="_blank" rel="noreferrer" title="부루계통 사이트 검색을 지원합니다.">IQDB 검색</a>
                    <a href="" class={styles.item} id="search-saucenao" target="_blank" rel="noreferrer" title="망가, 픽시브 사이트 검색을 지원합니다.">SauceNao 검색</a>
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
            context.setAttribute('style', `left: ${event.clientX}px; top: ${event.clientY}px`);
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
        context.querySelector('#search-iqdb').href = `https://iqdb.org/?url=${url}`;
        context.querySelector('#search-saucenao').href = `https://saucenao.com/search.php?db=999&dbmaski=32768&url=${url}`;

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

function onClickContextMenu(event) {
    const context = document.querySelector('#context-menu');

    if(event.target.id == 'copy-clipboard') {
        event.preventDefault();
        event.stopPropagation();

        const url = context.getAttribute('data-url');
        const menubtn = context.querySelector('#copy-clipboard');
        GM.xmlHttpRequest({
            method: 'GET',
            url,
            responseType: 'arraybuffer',
            onprogress: e => {
                menubtn.innerText = `다운로드 중...(${Math.round(e.loaded / e.total * 100)}%)`;
            },
            onload: response => {
                const buffer = response.response;
                const blob = new Blob([buffer], { type: 'image/png' });

                const item = new ClipboardItem({ [blob.type]: blob });
                navigator.clipboard.write([item]);
                context.parentNode.classList.add('hidden');
                menubtn.innerText = '이미지를 클립보드에 복사';
            },
        });
        return;
    }
    if(event.target.id == 'save') {
        event.preventDefault();

        const url = context.getAttribute('data-url');
        GM.xmlHttpRequest({
            method: 'GET',
            url,
            responseType: 'blob',
            onload: response => {
                const data = response.response;

                window.saveAs(data, `image.${data.type.split('/')[1]}`);
            },
        });
    }
    if(event.target.id == 'copy-url') {
        event.preventDefault();

        const url = `${context.getAttribute('data-url')}?type=orig`;
        navigator.clipboard.writeText(url);
    }
    if(event.target.id == 'apply-myimage') {
        event.preventDefault();

        const html = context.getAttribute('data-html');
        window.config.myImage = html;
        Setting.save(window.config);
        alert('선택한 짤이 등록되었습니다.\n새 게시물 작성 시 최상단에 자동으로 첨부됩니다.');
    }
}
