import ContextMenu from '../core/ContextMenu';
import Parser from '../core/Parser';
import { getBlob } from '../util/DownloadManager';

export default { load };

function load() {
  try {
    if (Parser.hasArticle()) {
      addContextMenu();
    }
  } catch (error) {
    console.error(error);
  }
}

function addContextMenu() {
  const searchGoogleItem = ContextMenu.createMenu({
    text: 'Google 검색',
    onClick(event) {
      event.preventDefault();

      const url = ContextMenu.getContextData('url');
      window.open(`https://www.google.com/searchbyimage?safe=off&image_url=${url}`);
      ContextMenu.hide();
    },
  });
  const searchYandexItem = ContextMenu.createMenu({
    text: 'Yandex 검색',
    description: '러시아 검색엔진입니다.',
    onClick(event) {
      event.preventDefault();

      const url = ContextMenu.getContextData('url');
      window.open(`https://yandex.com/images/search?rpt=imageview&url=${url}`);
      ContextMenu.hide();
    },
  });
  const searchSauceNaoItem = ContextMenu.createMenu({
    text: 'SauceNao 검색',
    description: '망가, 픽시브 이미지 검색을 지원합니다.',
    async onClick(event) {
      event.preventDefault();

      const url = ContextMenu.getContextData('url');
      const blob = await getBlob(
        url,
        (e) => {
          const progress = Math.round((e.loaded / e.total) * 100);
          event.target.textContent = `${progress}%`;
        },
        () => {
          event.target.textContent = '업로드 중...';
        }
      );

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
      window.open(
        `https://saucenao.com/search.php?db=999&url=https://saucenao.com/userdata/tmp/${replaceURL}`
      );
      ContextMenu.hide();
    },
  });
  const searchTwigatenItem = ContextMenu.createMenu({
    text: 'TwitGaTen 검색',
    description: '트위터 이미지 검색을 지원합니다.',
    async onClick(event) {
      event.preventDefault();

      const url = ContextMenu.getContextData('url');
      const blob = await getBlob(
        url,
        (e) => {
          const progress = Math.round((e.loaded / e.total) * 100);
          event.target.textContent = `${progress}%`;
        },
        () => {
          event.target.textContent = '업로드 중...';
        }
      );

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
      ContextMenu.hide();
    },
  });
  const searchAscii2dItem = ContextMenu.createMenu({
    text: 'Ascii2D 검색',
    description: '트위터, 픽시브 이미지 검색을 지원합니다.',
    async onClick(event) {
      event.preventDefault();

      const url = ContextMenu.getContextData('url');
      const blob = await getBlob(
        url,
        (e) => {
          const progress = Math.round((e.loaded / e.total) * 100);
          event.target.textContent = `${progress}%`;
        },
        () => {
          event.target.textContent = '업로드 중...';
        }
      );

      const docParser = new DOMParser();
      const tokenDocument = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'https://ascii2d.net',
          onload: (response) => {
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
      ContextMenu.hide();
    },
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

  ContextMenu.addMenuGroup('clickOnImage', contextElement);
}
