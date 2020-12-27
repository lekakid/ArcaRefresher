import Configure from '../core/Configure';
import ContextMenu from '../core/ContextMenu';
import Parser from '../core/Parser';
import { getBlob, getArrayBuffer } from '../util/DownloadManager';

import stylesheet from '../css/ImageDownloader.css';

export default { load };

const FILENAME = { key: 'imageDownloaderFileName', defaultValue: '%title%' };

function load() {
    try {
        addSetting();

        if(Parser.hasArticle()) {
            addContextMenu();
            apply();
        }
    }
    catch (error) {
        console.error(error);
    }
}

function addSetting() {
    const downloadName = (
        <input type="text" />
    );
    Configure.addSetting({
        category: Configure.categoryKey.UTILITY,
        header: '이미지 다운로드 포맷',
        option: downloadName,
        description: (
            <>
                이미지 일괄 다운로드 사용 시 저장할 파일의 이름 포맷입니다.<br />
                %title%: 게시물 제목<br />
                %category%: 게시물 카테고리<br />
                %author%: 게시물 작성자<br />
                %channel%: 채널 이름<br />
            </>
        ),
        callback: {
            save() {
                Configure.set(FILENAME, downloadName.value);
            },
            load() {
                downloadName.value = Configure.get(FILENAME);
            },
        },
    });
}

function addContextMenu() {
    const copyClipboardItem = ContextMenu.createMenu('클립보드에 복사');
    copyClipboardItem.addEventListener('click', async event => {
        event.preventDefault();

        const url = ContextMenu.getContextData('url');
        const title = event.target.textContent;

        const buffer = await getArrayBuffer(url,
            e => {
                const progress = Math.round(e.loaded / e.total * 100);
                event.target.textContent = `${progress}%`;
            },
            () => {
                event.target.textContent = title;
            });
        const blob = new Blob([buffer], { type: 'image/png' });
        const item = new ClipboardItem({ [blob.type]: blob });
        navigator.clipboard.write([item]);
        ContextMenu.hide();
    });
    const saveImageItem = ContextMenu.createMenu('이미지 저장');
    saveImageItem.addEventListener('click', async event => {
        event.preventDefault();

        const url = ContextMenu.getContextData('url');
        const title = event.target.textContent;

        const file = await getBlob(url,
            e => {
                const progress = Math.round(e.loaded / e.total * 100);
                event.target.textContent = `${progress}%`;
            },
            () => {
                event.target.textContent = title;
            });
        window.saveAs(file, `image.${file.type.split('/')[1]}`);
        ContextMenu.hide();
    });
    const copyURLItem = ContextMenu.createMenu('이미지 주소 복사');
    copyURLItem.addEventListener('click', event => {
        event.preventDefault();

        const url = ContextMenu.getContextData('url');
        navigator.clipboard.writeText(url);
        ContextMenu.hide();
    });

    const contextElement = (
        <div>
            {copyClipboardItem}
            {saveImageItem}
            {copyURLItem}
        </div>
    );

    ContextMenu.addMenuGroup('clickOnImage', contextElement);
}

function apply() {
    const data = parse();
    if(data.length == 0) return;

    const table = (
        <div class="article-image hidden">
            <style>{stylesheet}</style>
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
                        <button class="btn btn-arca">일괄 다운로드</button>
                    </td>
                </tfoot>
            </table>
        </div>
    );

    const enableBtn = <a href="#" class="btn btn-arca"><span class="ion-ios-download-outline" /> 이미지 다운로드 목록 보이기</a>;
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
                    <a href="#" data-url={d.url}>{d.name}</a>
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
                const file = await getBlob(url,
                    e => {
                        const progress = Math.round(e.loaded / e.total * 100);
                        event.target.textContent = `${filename}...${progress}%`;
                    },
                    () => {
                        event.target.textContent = filename;
                    });
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
            const file = await getBlob(downloadList[i],
                e => {
                    const progress = Math.round(e.loaded / e.total * 100);
                    downloadBtn.textContent = `다운로드 중...${progress}% (${i}/${total})`;
                });
            zip.file(`${`${i}`.padStart(3, '0')}_${nameList[i]}`, file);
        }
        downloadBtn.textContent = originalText;

        const channelInfo = Parser.getChannelInfo();
        const articleInfo = Parser.getArticleInfo();

        let filename = Configure.get(FILENAME);
        const reservedWord = filename.match(/%\w*%/g);
        if(reservedWord) {
            for(const word of reservedWord) {
                switch(word) {
                case '%title%':
                    filename = filename.replace(word, articleInfo.title);
                    break;
                case '%category%':
                    filename = filename.replace(word, articleInfo.category);
                    break;
                case '%author%':
                    filename = filename.replace(word, articleInfo.author);
                    break;
                case '%channel%':
                    filename = filename.replace(word, channelInfo.name);
                    break;
                default:
                    break;
                }
            }
        }
        const zipblob = await zip.generateAsync({ type: 'blob' });
        window.saveAs(zipblob, `${filename}.zip`);

        downloadBtn.disabled = false;
    });
}

const IMAGE_TYPE = ['gif', 'png', 'jpg', 'jpeg', 'wepb'];
function parse() {
    const images = document.querySelectorAll('.article-body img, .article-body video');

    const result = [];

    images.forEach(element => {
        let src = element.src.split('?')[0];
        if(element.dataset.orig) {
            src += `.${element.dataset.orig}`;
        }

        const filename = src.replace(/.*\.arca\.live\/.*\//, '').replace(/\..*\./, '.');
        const item = {
            thumb: `${src}?type=list`,
            url: `${src}?type=orig`,
            name: filename,
            type: IMAGE_TYPE.indexOf(filename.split('.')[1]) > -1 ? 'image' : 'video',
        };

        result.push(item);
    });

    return result;
}
