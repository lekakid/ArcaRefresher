import stylesheet from '../css/ImageDownloader.css';
import { defaultConfig } from './Setting';

export function apply() {
    const data = parse();
    if(data.length == 0) return;

    document.head.append(<style>{stylesheet}</style>);

    const table = (
        <div class="article-image hidden">
            <table class="table align-middle" id="imageList">
                <colgroup>
                    <col width="5%" />
                    <col width="10%" />
                    <col width="85%" />
                </colgroup>
                <thead>
                    <th><input type="checkbox" name="selectAll" /></th>
                    <th>썸네일</th>
                    <th>파일명</th>
                </thead>
                <tbody />
                <tfoot>
                    <td colspan="3">
                        <button class="btn btn-success">일괄 다운로드</button>
                    </td>
                </tfoot>
            </table>
        </div>
    );

    const enableBtn = <a href="#" class="btn btn-success"><span class="ion-ios-download-outline" /> 이미지 다운로드 목록 보이기</a>;
    enableBtn.addEventListener('click', event => {
        event.preventDefault();

        if(table.classList.contains('hidden')) {
            table.classList.remove('hidden');
        }
        else {
            table.classList.add('hidden');
        }
    });

    document.querySelector('.article-body')
        .insertAdjacentElement('afterend', enableBtn)
        .insertAdjacentElement('afterend', table);
    const list = table.querySelector('tbody');

    for(const d of data) {
        const itemElement = (
            <tr>
                <td>
                    <input type="checkbox" name="select" />
                </td>
                <td>
                    {d.type == 'image' && <img src={d.thumb} />}
                    {d.type != 'image' && <div class="video-placeholder"><span class="ion-ios-videocam"> 동영상</span></div>}
                </td>
                <td>
                    <a href="#" data-url={d.url}>{d.image}</a>
                </td>
            </tr>
        );

        list.append(itemElement);
    }

    table.addEventListener('click', async event => {
        if(event.target.tagName == 'A') {
            event.preventDefault();

            const url = event.target.dataset.url;
            if(url != '') {
                event.target.dataset.url = '';
                const filename = event.target.textContent;
                const file = await download(url, event.target, '다운로드 중...[percent]%', filename);
                window.saveAs(file, filename);
                event.target.dataset.url = url;
            }
        }
        else if(event.target.name == 'selectAll') {
            const inputElements = table.querySelectorAll('input[type="checkbox"]');
            for(const i of inputElements) {
                i.checked = event.target.checked;
            }
        }
    });

    const downloadBtn = table.querySelector('tfoot button');
    downloadBtn.addEventListener('click', async event => {
        event.preventDefault();
        downloadBtn.disabled = true;

        const checkboxElements = list.querySelectorAll('input[type="checkbox"]');
        const urlElements = list.querySelectorAll('a');

        const originalText = downloadBtn.textContent;

        const downloadList = [];
        const nameList = [];
        for(let i = 0; i < urlElements.length; i += 1) {
            if(checkboxElements[i].checked) {
                downloadList.push(urlElements[i].dataset.url);
                nameList.push(urlElements[i].textContent);
            }
        }

        if(downloadList.length == 0) {
            alert('선택된 파일이 없습니다.');
            downloadBtn.disabled = false;
            return;
        }

        const zip = new JSZip();
        const total = downloadList.length;
        for(let i = 0; i < total; i += 1) {
            const file = await download(downloadList[i], downloadBtn, `다운로드 중...[percent]% (${i}/${total})`);
            zip.file(`${`${i}`.padStart(3, '0')}_${nameList[i]}`, file);
        }
        downloadBtn.textContent = originalText;

        const title = document.querySelector('.article-head .title');
        const category = document.querySelector('.article-head .badge');
        const author = document.querySelector('.article-head .user-info');
        const channel = document.querySelector('.board-title a:not([class])');

        let filename = GM_getValue('imageDownloaderFileName', defaultConfig.imageDownloaderFileName);
        const reservedWord = filename.match(/%\w*%/g);
        for(const word of reservedWord) {
            try {
                switch(word) {
                case '%title%':
                    filename = filename.replace(word, title.textContent.trim());
                    break;
                case '%category%':
                    filename = filename.replace(word, category.textContent.trim());
                    break;
                case '%author%':
                    filename = filename.replace(word, author.innerText.trim());
                    break;
                case '%channel%':
                    filename = filename.replace(word, channel.textContent.trim());
                    break;
                default:
                    break;
                }
            }
            catch (error) {
                console.warn(error);
                filename = filename.replace(word, '');
            }
        }
        const zipblob = await zip.generateAsync({ type: 'blob' });
        window.saveAs(zipblob, `${filename}.zip`);

        downloadBtn.disabled = false;
    });
}

function parse() {
    const images = document.querySelectorAll('.article-body img, .article-body video');

    const result = [];

    images.forEach(element => {
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

export function download(url, element, progressString, loadString) {
    return new Promise(resolve => {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            responseType: 'blob',
            onprogress: event => {
                let text = null;
                if(progressString) {
                    text = progressString.replace('[percent]', Math.round(event.loaded / event.total * 100));
                }
                else {
                    text = `${Math.round(event.loaded / event.total * 100)}%`;
                }
                if(element) element.textContent = text;
            },
            onload: response => {
                if(loadString) element.textContent = loadString;
                resolve(response.response);
            },
        });
    });
}
