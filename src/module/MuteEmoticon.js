import { BOARD_LOADED, COMMENT_LOADED } from '../core/ArcaSelector';
import { addAREventListener } from '../core/AREventHandler';
import { addSetting, getValue, setValue } from '../core/Configure';
import { waitForElement } from '../core/LoadManager';
import { getDocument } from '../util/HttpRequest';

export default { load };

const BLOCK_EMOTICON = { key: 'blockEmoticon', defaultValue: {} };

async function load() {
  try {
    setupSetting();

    if (await waitForElement(COMMENT_LOADED)) {
      muteComment();
      appendMuteBtn();
    }

    if (await waitForElement(BOARD_LOADED)) {
      muteArticle();
      mutePreview();
    }

    addAREventListener('ArticleChange', {
      priority: 100,
      callback() {
        mutePreview();
      },
    });

    addAREventListener('CommentChange', {
      priority: 100,
      callback() {
        muteComment();
        appendMuteBtn();
      },
    });
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  const muteEmoticon = <select size="6" multiple="" />;
  const deleteBtn = <button className="btn btn-arca">삭제</button>;
  deleteBtn.addEventListener('click', (event) => {
    event.target.disabled = true;

    const removeElements = muteEmoticon.selectedOptions;
    while (removeElements.length > 0) removeElements[0].remove();

    event.target.disabled = false;
  });
  addSetting({
    header: '아카콘',
    group: [
      {
        title: '뮤트 설정',
        description: (
          <>
            아카콘 뮤트는 댓글에서 할 수 있습니다.
            <br />
            Ctrl, Shift, 마우스 드래그를 이용해서 여러개를 동시에 선택 할 수 있습니다.
          </>
        ),
        content: (
          <>
            {muteEmoticon}
            {deleteBtn}
          </>
        ),
        type: 'wide',
      },
    ],
    configHandler: {
      save() {
        const data = getValue(BLOCK_EMOTICON);

        const keys = Array.from(muteEmoticon.children, (e) => e.value);
        for (const key in data) {
          if (keys.indexOf(key) === -1) delete data[key];
        }
        setValue(BLOCK_EMOTICON, data);
      },
      load() {
        const data = getValue(BLOCK_EMOTICON);
        while (muteEmoticon.firstChild) muteEmoticon.lastChild.remove();
        for (const key of Object.keys(data)) {
          muteEmoticon.append(<option value={key}>{data[key].name}</option>);
        }
      },
    },
  });
}

function mutePreview() {
  if (document.readyState !== 'complete') {
    window.addEventListener(
      'load',
      () => {
        mutePreview();
      },
      { once: true }
    );
    return;
  }

  const blockEmoticons = getValue(BLOCK_EMOTICON);

  let list = [];
  for (const key in blockEmoticons) {
    if ({}.hasOwnProperty.call(blockEmoticons, key)) {
      list = list.concat(blockEmoticons[key].url);
    }
  }

  const images = document.querySelectorAll('.vrow-preview noscript, .vrow-preview img');
  images.forEach((e) => {
    let url;
    if (e.matches('img')) {
      url = e.src.replace('https:', '').replace('?type=list', '');
    } else {
      url = e.textContent.match(/\/\/.+\?/g)[0].replace('?', '');
    }

    if (list.indexOf(url) > -1) {
      e.parentNode.remove();
    }
  });
}

function muteArticle() {
  const blockEmoticons = getValue(BLOCK_EMOTICON);

  let list = [];
  for (const key in blockEmoticons) {
    if ({}.hasOwnProperty.call(blockEmoticons, key)) {
      list = list.concat(blockEmoticons[key].url);
    }
  }

  const images = document.querySelectorAll('.article-body img');

  images.forEach((e) => {
    if (e.clientWidth > 100 || e.clientHeight > 100) return;

    const url = e.src.replace('https:', '');

    if (list.indexOf(url) > -1) {
      e.replaceWith(<p>[아카콘 뮤트됨]</p>);
    }
  });
}

function muteComment() {
  const blockEmoticons = getValue(BLOCK_EMOTICON);

  let list = [];
  for (const key in blockEmoticons) {
    if ({}.hasOwnProperty.call(blockEmoticons, key)) {
      list = list.concat(blockEmoticons[key].bundle);
    }
  }

  const comments = document.querySelectorAll('#comment .comment-item');
  comments.forEach((item) => {
    const emoticon = item.querySelector('.emoticon');

    if (emoticon) {
      const id = Number(emoticon.dataset.id);
      if (list.indexOf(id) > -1) {
        emoticon.closest('.message').innerText = '[아카콘 뮤트됨]';
      }
    }
  });
}

function appendMuteBtn() {
  const commentArea = document.querySelector('#comment');
  if (!commentArea) return;

  const emoticons = commentArea.querySelectorAll('.emoticon');

  emoticons.forEach((item) => {
    const btn = (
      <span>
        {'\n | '}
        <a
          href="#"
          className="block-emoticon"
          data-id={item.dataset.id}
          data-url={item.src.replace('https:', '')}
        >
          <span className="ion-ios-close" />
          {' 아카콘 뮤트'}
        </a>
      </span>
    );

    const timeElement = item.closest('.content').querySelector('.right > time');
    timeElement.insertAdjacentElement('afterend', btn);
  });

  commentArea.addEventListener('click', async (event) => {
    if (!event.target.classList.contains('block-emoticon')) return;

    try {
      event.preventDefault();

      event.target.textContent = '뮤트 처리 중...';
      event.target.classList.remove('block-emoticon');
      const id = event.target.dataset.id;
      const img = event.target.dataset.url;

      const blockEmoticon = getValue(BLOCK_EMOTICON);
      const [name, bundleID] = await getEmoticonInfo(id);
      if (blockEmoticon[bundleID]) {
        blockEmoticon[bundleID].bundle.push(Number(id));
        blockEmoticon[bundleID].url.push(img);
      } else {
        const [bundle, url] = await getEmoticonBundle(bundleID);
        blockEmoticon[bundleID] = { name, bundle, url };
      }
      setValue(BLOCK_EMOTICON, blockEmoticon);
    } catch (error) {
      alert(error);
      console.error(error);
    }
    window.location.reload();
  });
}

async function getEmoticonInfo(id) {
  const response = await getDocument({
    method: 'GET',
    url: `/api/emoticon/shop/${id}`,
    timeout: 10000,
    error: new Error('이모티콘 정보를 받아오지 못했습니다.\n사유: 접속 실패'),
  });
  try {
    const bundleID = response.finalUrl.match(/[0-9]+$/)[0];
    const nameElement = response.response.querySelector('.article-head .title');
    let name = `삭제된 이모티콘 - ${bundleID}`;
    if (nameElement) name = nameElement.textContent;
    return [name, bundleID];
  } catch (error) {
    throw new Error('이모티콘 정보를 받아오지 못했습니다.\n사유: 사이트 구조 변경, 기타');
  }
}

function getEmoticonBundle(bundleID) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `/api/emoticon/${bundleID}`,
      responseType: 'json',
      onload({ response }) {
        const bundle = response.map((item) => item.id);
        const url = response.map((item) => item.imageUrl);
        resolve([bundle, url]);
      },
      ontimeout() {
        reject(new Error('이모티콘 번들 정보를 받아오지 못했습니다.\n사유: Timeout'));
      },
      onerror(error) {
        reject(new Error('이모티콘 번들 정보를 받아오지 못했습니다.\n사유: 접속 실패', error));
      },
    });
  });
}
