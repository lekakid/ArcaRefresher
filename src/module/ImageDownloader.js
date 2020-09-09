import stylesheet from '../css/ImageDownloader.css';

export function apply() {
    const data = parse();
    if(data.length == 0) return;

    document.head.append(<style>{stylesheet}</style>);

    const body = (
        <div class="article-images hidden">
            <div class="article-list">
                <div class="list-table">
                    <div class="vrow head">
                        <div class="vrow-top">
                            <span class="vcol col-thumb">썸네일</span>
                            <span class="vcol col-image">이미지</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const footerItem = (
        <div class="vrow">
            <div class="vrow-top">
                <button class="vcol col-download btn btn-success">
                    <span class="total">일괄 다운로드</span><br />
                    <span class="progressPercent" />
                </button>
            </div>
        </div>
    );

    const button = <a href="#" class="btn btn-success"><span class="ion-ios-download-outline" /> 이미지 다운로드 목록 보이기</a>;
    button.addEventListener('click', event => {
        event.preventDefault();

        if(body.classList.contains('hidden')) {
            body.classList.remove('hidden');
        }
        else {
            body.classList.add('hidden');
        }
    });

    document.querySelector('.article-body').insertAdjacentElement('afterend', body);
    document.querySelector('.article-body').insertAdjacentElement('afterend', button);
    const list = body.querySelector('.list-table');

    list.addEventListener('click', onListClick);

    async function onListClick(event) {
        if(event.target.tagName != 'A') return;

        event.preventDefault();

        const url = event.target.getAttribute('data-url');
        const file = await download(url);

        window.saveAs(file, event.target.innerText);
    }

    data.forEach(dataItem => {
        const itemElement = (
            <div class="vrow">
                <div class="vrow-top">
                    <span class="vcol col-thumb">
                        {dataItem.type == 'image' && <img src={dataItem.thumb} />}
                        {dataItem.type != 'image' && <div class="video-placeholder"><span class="ion-ios-videocam"> 동영상</span></div>}
                    </span>
                    <a class="vcol col-image" href="#" data-url={dataItem.url}>{dataItem.image}</a>
                </div>
            </div>
        );

        list.append(itemElement);
    });

    async function onDownloadAll() {
        const zip = new JSZip();
        const total = data.length;
        let current = 0;

        this.disabled = true;

        const totalElement = this.querySelector('.total');
        const progressElement = this.querySelector('.progressPercent');

        const originalText = totalElement.textContent;

        for(const d of data) {
            let file = null;

            while(file == null) {
                totalElement.textContent = `다운로드 중...${current}/${total}`;
                file = await download(d.url, progressElement);
            }
            zip.file(`${`${++current}`.padStart(3, '0')}_${d.image}`, file);
        }

        totalElement.textContent = originalText;
        progressElement.textContent = '';

        this.disabled = false;

        const zipblob = await zip.generateAsync({ type: 'blob' });
        const title = document.querySelector('.article-head .title').textContent.trim();
        window.saveAs(zipblob, `${title}.zip`);
    }

    footerItem.querySelector('button').addEventListener('click', onDownloadAll);
    list.append(footerItem);
}

function parse() {
    const images = document.querySelectorAll('.article-body img, .article-body video');

    const result = [];

    images.forEach(element => {
        // if(element.tagName == 'VIDEO' && element.getAttribute('data-orig') == null) return;

        let src = element.src;

        if(element.getAttribute('data-orig') != null) {
            src += `.${element.getAttribute('data-orig')}`;
        }

        const item = {};
        item.thumb = `${src}?type=list`;
        item.url = `${src}?type=orig`;
        item.image = src.replace(/.*\.arca\.live\/.*\//, '').replace(/\..*\./, '.');
        item.type = ['gif', 'png', 'jpg', 'jpeg', 'wepb'].indexOf(item.image.split('.')[1]) > -1 ? 'image' : 'video';

        result.push(item);
    });

    return result;
}

export function download(url, element) {
    return new Promise(resolve => {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            responseType: 'blob',
            onprogress: event => {
                if(element) element.textContent = `${Math.round(event.loaded / event.total * 100)}%`;
            },
            onload: response => {
                resolve(response.response);
            },
        });
    });
}
