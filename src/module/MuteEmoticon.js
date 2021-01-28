import { addOnModifyComment } from '../core/AREventHandler';
import { addSetting, getValue, setValue } from '../core/Configure';
import { CurrentPage } from '../core/Parser';

export default { load };

const BLOCK_EMOTICON = { key: 'blockEmoticon', defaultValue: {} };

function load() {
  try {
    setupSetting();

    if (CurrentPage.Component.Comment) {
      mute();
      apply();
    }

    addOnModifyComment({
      priority: 100,
      callback() {
        mute();
        apply();
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
    valueCallback: {
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
        for (const key of Object.keys(data)) {
          muteEmoticon.append(<option value={key}>{data[key].name}</option>);
        }
      },
    },
  });
}

function mute() {
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

function apply() {
  const commentArea = document.querySelector('#comment');
  const emoticons = commentArea.querySelectorAll('.emoticon');

  emoticons.forEach((item) => {
    const btn = (
      <span>
        {'\n | '}
        <a href="#" className="block-emoticon" data-id={item.dataset.id}>
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
      const [name, bundleID] = await getEmoticonInfo(id);
      const bundle = await getEmoticonBundle(bundleID);

      const blockEmoticon = getValue(BLOCK_EMOTICON);
      blockEmoticon[bundleID] = { name, bundle };
      setValue(BLOCK_EMOTICON, blockEmoticon);
    } catch (error) {
      alert(error);
      console.error(error);
    }
    window.location.reload();
  });
}

function getEmoticonInfo(id) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `/api/emoticon/shop/${id}`,
      responseType: 'document',
      timeout: 10000,
      onload({ response }) {
        try {
          const name = response.querySelector('.article-head .title').textContent;
          const bundleID = response
            .querySelector('.article-body form')
            .action.split('/e/')[1]
            .split('/')[0];
          resolve([name, bundleID]);
        } catch (error) {
          reject(
            new Error('이모티콘 정보를 받아오지 못했습니다.\n사유: 삭제, 사이트 구조 변경, 기타')
          );
        }
      },
      ontimeout() {
        reject(new Error('이모티콘 정보를 받아오지 못했습니다.\n사유: Timeout'));
      },
      onerror(error) {
        reject(new Error('이모티콘 정보를 받아오지 못했습니다.\n사유: 접속 실패', error));
      },
    });
  });
}

function getEmoticonBundle(bundleID) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `/api/emoticon/${bundleID}`,
      responseType: 'json',
      onload({ response }) {
        const bundle = response.map((item) => item.id);
        resolve(bundle);
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
