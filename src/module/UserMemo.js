import {
  ARTICLE_LOADED,
  ARTICLE_VIEW,
  AUDIT_LOADED,
  AUDIT_VIEW,
  BOARD_LOADED,
  BOARD_VIEW,
  USER_INFO,
} from '../core/ArcaSelector';
import { addAREventListener } from '../core/AREventHandler';
import { addSetting, getValue, setValue } from '../core/Configure';
import { waitForElement } from '../core/LoadManager';
import { parseUserID } from '../core/Parser';

export default { load };

const USER_MEMO = { key: 'userMemo', defaultValue: {} };

async function load() {
  try {
    setupSetting();

    if (await waitForElement(ARTICLE_LOADED)) {
      addEvent(ARTICLE_VIEW);
    }

    if (await waitForElement(BOARD_LOADED)) {
      appendMemo();
      addEvent(BOARD_VIEW);
    }

    if (await waitForElement(AUDIT_LOADED)) {
      appendMemo();
      addEvent(AUDIT_VIEW);
    }

    addAREventListener('ArticleChange', {
      priority: 100,
      callback: appendMemo,
    });
    addAREventListener('CommentChange', {
      priority: 100,
      callback: appendMemo,
    });
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  const memoTextarea = <textarea rows="6" placeholder="닉네임::메모" />;

  addSetting({
    header: '메모',
    group: [
      {
        title: '메모 목록',
        description: (
          <>
            아래의 양식을 지켜주시기 바랍니다.
            <br />
            <ul>
              <li>고정닉::메모</li>
              <li>#00000000::메모</li>
              <li>(000.000)::메모</li>
            </ul>
          </>
        ),
        content: memoTextarea,
        type: 'wide',
      },
    ],
    configHandler: {
      save() {
        const memoList = memoTextarea.value.split('\n').filter((i) => i !== '');
        const data = {};
        for (const m of memoList) {
          const [key, value] = m.split('::');
          data[key] = value;
        }

        setValue(USER_MEMO, data);
      },
      load() {
        const data = getValue(USER_MEMO);
        const memoList = [];
        for (const key of Object.keys(data)) {
          memoList.push(`${key}::${data[key]}`);
        }
        memoTextarea.value = memoList.join('\n');
      },
    },
  });
}

function appendMemo() {
  const users = document.querySelectorAll(USER_INFO);
  const memos = getValue(USER_MEMO);

  users.forEach((user) => {
    const id = parseUserID(user);

    let slot = user.querySelector('.memo');
    if (memos[id]) {
      if (slot == null) {
        slot = <span className="memo" />;
        user.append(slot);
      }
      slot.textContent = ` - ${memos[id]}`;
      user.title = memos[id];
    } else if (slot) {
      slot.remove();
      user.title = '';
    }
  });
}

function addEvent(containerSelector) {
  const container = document.querySelector(containerSelector);
  const memos = getValue(USER_MEMO);

  container.addEventListener('click', (event) => {
    if (event.target.closest('a')) return;

    const user = event.target.closest(USER_INFO);
    if (user == null) return;

    event.preventDefault();

    const id = parseUserID(user);
    const newMemo = prompt('이용자 메모를 설정합니다.\n', memos[id] || '');
    if (newMemo == null) return;

    let slot = user.querySelector('.memo');
    if (slot == null) {
      slot = <span className="memo" />;
      user.append(slot);
    }

    if (newMemo) {
      slot.textContent = ` - ${newMemo}`;
      memos[id] = newMemo;
    } else {
      slot.remove();
      delete memos[id];
    }

    setValue(USER_MEMO, memos);
    appendMemo();
  });
}
