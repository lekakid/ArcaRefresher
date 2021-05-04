import ContextMenu from '../core/ContextMenu';
import { CurrentPage } from '../core/Parser';
import { getBlob, getDocument } from '../util/HttpRequest';

export default { load };

function load() {
  try {
    if (CurrentPage.Component.Article) {
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
      const itemText = event.target.textContent;

      try {
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

        if (blob.size > 15 * 1024 * 1024) {
          alert('SauceNao 업로드 용량 제한(15MB)을 초과했습니다.');
          return;
        }

        const formdata = new FormData();
        formdata.append('file', blob, `image.${blob.type.split('/')[1]}`);
        formdata.append('frame', 1);
        formdata.append('database', 999);

        const response = await getDocument({
          method: 'POST',
          url: 'https://saucenao.com/search.php',
          data: formdata,
          error: new Error('SauceNao 연결 거부 됨'),
        });
        const searchedImage = response.response.querySelector('#yourimage a');
        if (!searchedImage) throw new Error('SauceNao 이미지 업로드 실패');

        const replaceURL = searchedImage.href.split('image=')[1];
        window.open(
          `https://saucenao.com/search.php?db=999&url=https://saucenao.com/userdata/tmp/${replaceURL}`
        );
      } catch (error) {
        console.error(error);
        alert(
          `개발자 도구(F12)의 콘솔창의 오류 메세지를 같이 제보 바랍니다.\n사유: ${error.message}`
        );
      }
      ContextMenu.hide();
      event.target.textContent = itemText;
    },
  });
  const searchTwigatenItem = ContextMenu.createMenu({
    text: 'TwitGaTen 검색',
    description: '트위터 이미지 검색을 지원합니다.',
    async onClick(event) {
      event.preventDefault();
      const itemText = event.target.textContent;

      try {
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
              reject(new Error('TwitGaTen 연결 거부 됨'));
            },
          });
        });

        window.open(result.finalUrl);
      } catch (error) {
        console.error(error);
        alert(
          `개발자 도구(F12)의 콘솔창의 오류 메세지를 같이 제보 바랍니다.\n사유: ${error.message}`
        );
      }
      ContextMenu.hide();
      event.target.textContent = itemText;
    },
  });
  const searchAscii2dItem = ContextMenu.createMenu({
    text: 'Ascii2D 검색',
    description: '트위터, 픽시브 이미지 검색을 지원합니다.',
    async onClick(event) {
      event.preventDefault();
      const itemText = event.target.textContent;

      try {
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
              reject(new Error('Ascii2D 토큰 획득 시도 중 연결 거부 됨'));
            },
          });
        });
        const tokenElement = tokenDocument.querySelector('input[name="authenticity_token"]');
        if (!tokenElement) throw new Error('Ascii2d 검색 토큰 데이터 획득 실패');
        const token = tokenElement.value;

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
              reject(new Error('Ascii2D 이미지 검색 시도 중 연결 거부 됨'));
            },
          });
        });

        window.open(result.finalUrl);
      } catch (error) {
        console.error(error);
        alert(
          `개발자 도구(F12)의 콘솔창의 오류 메세지를 같이 제보 바랍니다.\n사유: ${error.message}`
        );
      }
      ContextMenu.hide();
      event.target.textContent = itemText;
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
