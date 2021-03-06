import { addSetting, getValue, setValue } from '../core/Configure';
import * as ContextMenu from '../core/ContextMenu';
import { getBlob } from '../util/HttpRequest';

import stylesheet from '../css/ImageDownloader.css';
import { waitForElement } from '../core/LoadManager';
import { ARTICLE_LOADED } from '../core/ArcaSelector';
import { parseChannelTitle, parseUserInfo } from '../core/Parser';

export default { load };

const FILENAME = { key: 'imageDownloaderFileName', defaultValue: '%title%' };
const ZIPNAME = { key: 'imageDownloaderZipName', defaultValue: '%title%' };
const IMAGENAME = { key: 'imageDonwloaderImageName', defaultValue: '%num%' };
const ZIP_COMMENT = {
  key: 'imageDownloaderZipComment',
  defaultValue: '[%channel%] %title% - %url%',
};
const RETRY_COUNT = { key: 'imageDownloaderRetry', defaultValue: 3 };

async function load() {
  try {
    setupSetting();

    if (await waitForElement(ARTICLE_LOADED)) {
      addContextMenu();
      apply();
    }
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  const fileName = <input type="text" />;
  const zipName = <input type="text" />;
  const imageName = <input type="text" />;
  const zipComment = <textarea rows="6" />;
  const retryCount = (
    <select>
      <option value="1">1회</option>
      <option value="2">2회</option>
      <option value="3">3회</option>
    </select>
  );

  addSetting({
    header: '이미지 다운로드',
    group: [
      {
        title: '우클릭 메뉴 저장 시 이미지 이름',
        description: (
          <>
            우클릭 다운로드 사용 시 저장할 파일의 이름입니다.
            <br />
            %orig%: 이미지 업로드명 (64자 코드)
            <br />
            %title%: 게시물 제목
            <br />
            %category%: 게시물 카테고리
            <br />
            %author%: 게시물 작성자
            <br />
            %channel%: 채널 이름
          </>
        ),
        content: fileName,
        type: 'wide',
      },
      {
        title: '압축파일 이름',
        description: (
          <>
            이미지 일괄 다운로드 사용 시 저장할 압축 파일의 이름입니다.
            <br />
            %title%: 게시물 제목
            <br />
            %category%: 게시물 카테고리
            <br />
            %author%: 게시물 작성자
            <br />
            %channel%: 채널 이름
          </>
        ),
        content: zipName,
        type: 'wide',
      },
      {
        title: '압축파일 내 이미지 이름',
        description: (
          <>
            저장할 압축파일 내 이미지의 이름입니다.
            <br />
            orig 혹은 num을 사용하여 이름을 구분해야 정상적으로 구별됩니다.
            <br />
            <br />
            %orig%: 이미지 업로드명 (64자 코드)
            <br />
            %num%: 넘버링 (000~999)
            <br />
            %title%: 게시물 제목
            <br />
            %category%: 게시물 카테고리
            <br />
            %author%: 게시물 작성자
            <br />
            %channel%: 채널 이름
          </>
        ),
        content: imageName,
        type: 'wide',
      },
      {
        title: '압축파일 코멘트',
        description: (
          <>
            저장할 압축파일에 남길 코멘트입니다.
            <br />
            %title%: 게시물 제목
            <br />
            %category%: 게시물 카테고리
            <br />
            %author%: 게시물 작성자
            <br />
            %channel%: 채널 이름
            <br />
            %url%: 게시물 주소
          </>
        ),
        content: zipComment,
        type: 'wide',
      },
      {
        title: '다운로드 최대 시도 횟수',
        content: retryCount,
      },
    ],
    configHandler: {
      save() {
        setValue(FILENAME, fileName.value);
        setValue(ZIPNAME, zipName.value);
        setValue(IMAGENAME, imageName.value);
        setValue(ZIP_COMMENT, zipComment.value);
        setValue(RETRY_COUNT, Number(retryCount.value));
      },
      load() {
        fileName.value = getValue(FILENAME);
        zipName.value = getValue(ZIPNAME);
        imageName.value = getValue(IMAGENAME);
        zipComment.value = getValue(ZIP_COMMENT);
        retryCount.value = getValue(RETRY_COUNT);
      },
    },
  });
}

function addContextMenu() {
  const copyClipboardItem = ContextMenu.createMenu({
    text: '클립보드에 복사',
    async onClick(event) {
      event.preventDefault();

      const url = ContextMenu.getContextData('url');
      const title = event.target.textContent;

      const retryCount = getValue(RETRY_COUNT);
      try {
        for (let r = 1; r < retryCount; r += 1) {
          try {
            const rawData = await getBlob(
              url,
              (e) => {
                const progress = Math.round((e.loaded / e.total) * 100);
                event.target.textContent = `${progress}%`;
              },
              () => {
                event.target.textContent = '클립보드에 복사 중...';
              }
            );

            const canvas = document.createElement('canvas');
            const canvasContext = canvas.getContext('2d');
            const convertedBlob = await new Promise((resolve) => {
              const img = new Image();
              img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                canvasContext.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                  resolve(blob);
                });
              };
              img.src = URL.createObjectURL(rawData);
            });
            const item = new ClipboardItem({ [convertedBlob.type]: convertedBlob });
            navigator.clipboard.write([item]);
            event.target.textContent = title;
            break;
          } catch (error) {
            if (r >= retryCount) {
              throw Error('다운로드 최대 시도 횟수를 초과했습니다.');
            }
          }
        }
      } catch (error) {
        alert(error);
        console.error(error);
      }

      ContextMenu.hide();
    },
  });
  const saveImageItem = ContextMenu.createMenu({
    text: '이미지 저장',
    async onClick(event) {
      event.preventDefault();

      const title = event.target.textContent;
      const url = ContextMenu.getContextData('url');
      const ext = url.substring(url.lastIndexOf('.'), url.lastIndexOf('?'));
      let imagename = replaceData(getValue(FILENAME));
      imagename = imagename.replace('%num%', '000');
      imagename = imagename.replace('%orig%', url.match(/[0-9a-f]{64}/)[0]);

      const retryCount = getValue(RETRY_COUNT);
      try {
        for (let r = 1; r <= retryCount; r += 1) {
          try {
            const file = await getBlob(
              url,
              (e) => {
                const progress = Math.round((e.loaded / e.total) * 100);
                event.target.textContent = `${progress}%`;
              },
              () => {
                event.target.textContent = title;
              }
            );
            window.saveAs(file, `${imagename}${ext}`);
            break;
          } catch (error) {
            if (r >= retryCount) {
              throw Error('다운로드 최대 시도 횟수를 초과했습니다.');
            }
            console.error(error);
          }
        }
      } catch (error) {
        alert(error);
        console.error(error);
      }

      ContextMenu.hide();
    },
  });
  const copyURLItem = ContextMenu.createMenu({
    text: '이미지 주소 복사',
    onClick(event) {
      event.preventDefault();

      const url = ContextMenu.getContextData('url');
      navigator.clipboard.writeText(url);
      ContextMenu.hide();
    },
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
  if (data.length === 0) return;

  const itemContainer = <div className="image-list" />;
  for (const d of data) {
    const style = { backgroundImage: `url(${d.thumb})` };
    itemContainer.append(
      <div>
        <label className="item" style={style} data-url={d.url} data-filename={d.filename}>
          <input type="checkbox" name="select" />
        </label>
      </div>
    );
  }

  itemContainer.addEventListener('dblclick', (event) => {
    event.preventDefault();
    window.getSelection().removeAllRanges();

    const label = event.target.closest('.item');
    if (label) {
      event.preventDefault();
      const value = !label.children[0].checked;

      for (const child of itemContainer.children) {
        child.querySelector('input[type="checkbox"]').checked = value;
      }
    }
  });

  const downloadBtn = <button className="btn btn-arca">일괄 다운로드</button>;
  downloadBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    downloadBtn.disabled = true;

    const checkedElements = itemContainer.querySelectorAll('input[type="checkbox"]:checked');

    if (checkedElements.length === 0) {
      alert('선택된 파일이 없습니다.');
      downloadBtn.disabled = false;
      return;
    }

    const zip = new JSZip();
    const originalText = downloadBtn.textContent;
    const total = checkedElements.length;
    const configureName = getValue(IMAGENAME);
    const retryCount = getValue(RETRY_COUNT);
    let errorCount = 0;
    for (let i = 0; i < checkedElements.length; i += 1) {
      let imagename = replaceData(configureName);
      const { url, filename: orig } = checkedElements[i].parentNode.dataset;
      const ext = url.substring(url.lastIndexOf('.'), url.lastIndexOf('?'));
      try {
        for (let r = 1; r <= retryCount; r += 1) {
          try {
            const file = await getBlob(url, (e) => {
              const progress = Math.round((e.loaded / e.total) * 100);
              downloadBtn.textContent = `다운로드 중...${progress}% (${i}/${total})`;
            });

            imagename = imagename.replace('%orig%', orig);
            imagename = imagename.replace('%num%', `${i}`.padStart(3, '0'));
            zip.file(`${imagename}${ext}`, file);
            break;
          } catch (error) {
            if (r >= retryCount) {
              throw Error('다운로드 최대 시도 횟수를 초과했습니다.');
            }
          }
        }
      } catch (error) {
        errorCount += 1;
        console.error(error);
      }
    }
    downloadBtn.textContent = originalText;

    if (errorCount >= checkedElements.length) {
      alert(
        '다운로드한 이미지가 없습니다.\n개발자 도구(F12) 콘솔창의 오류 메세지를 같이 제보바랍니다.'
      );
      downloadBtn.disabled = false;
      return;
    }

    let comment = getValue(ZIP_COMMENT);
    comment = replaceData(comment);

    let filename = getValue(ZIPNAME);
    filename = replaceData(filename);
    const zipblob = await zip.generateAsync({ type: 'blob', comment });
    window.saveAs(zipblob, `${filename}.zip`);

    if (errorCount) {
      alert(
        '일부 이미지 다운로드 중 오류가 발생했습니다.\n개발자 도구(F12) 콘솔창의 오류 메세지를 같이 제보 바랍니다.'
      );
    }

    downloadBtn.disabled = false;
  });

  const wrapper = (
    <div className="article-image hidden">
      <style>{stylesheet}</style>
      {itemContainer}
      <div>더블클릭을 하면 이미지를 모두 선택할 수 있습니다.</div>
      {downloadBtn}
    </div>
  );

  const enableBtn = (
    <a href="#" className="btn btn-arca">
      <span className="ion-ios-download-outline" /> 이미지 다운로드 목록 보이기
    </a>
  );
  enableBtn.addEventListener('click', (event) => {
    event.preventDefault();

    if (wrapper.classList.contains('hidden')) {
      wrapper.classList.remove('hidden');
    } else {
      wrapper.classList.add('hidden');
    }
  });

  document
    .querySelector('.article-body')
    .insertAdjacentElement('afterend', enableBtn)
    .insertAdjacentElement('afterend', wrapper);
}

function replaceData(string) {
  string = string.replace('%title%', CurrentPage.Title);
  string = string.replace('%category%', CurrentPage.Category);
  string = string.replace('%author%', CurrentPage.Author);
  string = string.replace('%channel%', CurrentPage.ChannelName);
  string = string.replace('%url%', CurrentPage.URL);

  return string;
}

const CurrentPage = {
  Title: '',
  Category: '',
  Author: '',
  ChannelName: '',
  URL: '',
};

function parse() {
  const titleElement = document.querySelector('.article-head .title');
  CurrentPage.Title = titleElement ? titleElement.lastChild.textContent.trim() : '제목 없음';
  const categoryElement = document.querySelector('.article-head .badge');
  CurrentPage.Category = categoryElement ? categoryElement.textContent : '일반';
  const authorElement = document.querySelector('.article-head .user-info');
  CurrentPage.Author = authorElement ? parseUserInfo(authorElement) : '익명';
  CurrentPage.ChannelName = parseChannelTitle();
  const urlElement = document.querySelector('.article-body .article-link a');
  CurrentPage.URL = urlElement ? urlElement.href : window.location.href;

  const images = document.querySelectorAll(
    '.article-body  img, .article-body video:not([controls])'
  );

  const result = [];

  images.forEach((element) => {
    const filepath = element.src.split('?')[0];

    const thumb = `${filepath}${element.tagName === 'VIDEO' ? '.gif' : ''}?type=list`;
    const url = `${filepath}${element.tagName === 'VIDEO' ? '.gif' : ''}?type=orig`;
    const filename = filepath.match(/[0-9a-f]{64}/)[0];

    result.push({
      thumb,
      url,
      filename,
    });
  });

  return result;
}
