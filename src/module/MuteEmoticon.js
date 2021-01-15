import { addSetting, getValue, setValue } from '../core/Configure';
import Parser from '../core/Parser';
import CommentRefresh from './CommentRefresh';

export default { load };

const BLOCK_EMOTICON = { key: 'blockEmoticon', defaultValue: {} };

function load() {
  try {
    setupSetting();

    if (Parser.hasComment()) {
      mute();
      apply();
    }

    CommentRefresh.addRefreshCallback({
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
    category: 'MUTE',
    header: '뮤트된 아카콘',
    view: (
      <>
        {muteEmoticon}
        {deleteBtn}
      </>
    ),
    description: (
      <>
        아카콘 뮤트는 댓글에서 할 수 있습니다.
        <br />
        Ctrl, Shift, 마우스 드래그를 이용해서 여러개를 동시에 선택 할 수 있습니다.
      </>
    ),
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

  const comments = Parser.queryItems('comments', 'comment');
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
  const commentArea = Parser.queryView('comment');
  const emoticons = Parser.queryItems('emoticons', 'comment');

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

    event.preventDefault();

    event.target.textContent = '뮤트 처리 중...';
    event.target.classList.remove('block-emoticon');
    const id = event.target.dataset.id;
    const [name, bundleID] = await getEmoticonInfo(id);
    const bundle = await getEmoticonBundle(bundleID);

    const blockEmoticon = getValue(BLOCK_EMOTICON);
    blockEmoticon[bundleID] = { name, bundle };
    setValue(BLOCK_EMOTICON, blockEmoticon);
    window.location.reload();
  });
}

function getEmoticonInfo(id) {
  return new Promise((resolve) => {
    const req = new XMLHttpRequest();

    req.open('GET', `/api/emoticon/shop/${id}`);
    req.responseType = 'document';
    req.addEventListener('load', () => {
      const name = req.response.querySelector('.article-head .title').innerText;
      const bundleID = req.response.URL.split('/e/')[1];
      resolve([name, bundleID]);
    });
    req.send();
  });
}

function getEmoticonBundle(bundleID) {
  return new Promise((resolve) => {
    const req = new XMLHttpRequest();

    req.open('GET', `/api/emoticon/${bundleID}`);
    req.responseType = 'json';
    req.addEventListener('load', () => {
      const bundle = req.response.map((item) => item.id);
      resolve(bundle);
    });
    req.send();
  });
}
