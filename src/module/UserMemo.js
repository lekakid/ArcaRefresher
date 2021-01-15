import { addSetting, getValue, setValue } from '../core/Configure';
import Parser from '../core/Parser';

import AutoRefresher from './AutoRefresher';
import CommentRefresh from './CommentRefresh';

export default { load };

const USER_MEMO = { key: 'userMemo', defaultValue: {} };

let handlerApplied = false;

function load() {
  try {
    setupSetting();

    apply();

    AutoRefresher.addRefreshCallback({
      priority: 100,
      callback: apply,
    });
    CommentRefresh.addRefreshCallback({
      priority: 100,
      callback: apply,
    });
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  const memoList = <select size="6" multiple="" />;
  const deleteBtn = <button className="btn btn-arca">삭제</button>;
  deleteBtn.addEventListener('click', (event) => {
    event.target.disabled = true;

    const removeElements = memoList.selectedOptions;
    while (removeElements.length > 0) removeElements[0].remove();

    event.target.disabled = false;
  });
  addSetting({
    category: 'MEMO',
    header: '메모된 이용자',
    view: (
      <>
        {memoList}
        {deleteBtn}
      </>
    ),
    description: (
      <>
        메모는 게시물 작성자, 댓글 작성자 아이콘(IP)을 클릭해 할 수 있습니다.
        <br />
        Ctrl, Shift, 마우스 드래그를 이용해서 여러개를 동시에 선택 할 수 있습니다.
      </>
    ),
    valueCallback: {
      save() {
        const data = getValue(USER_MEMO);

        const keys = Array.from(memoList.children, (e) => e.value);
        for (const key in data) {
          if (keys.indexOf(key) === -1) delete data[key];
        }
        setValue(USER_MEMO, data);
      },
      load() {
        const data = getValue(USER_MEMO);
        while (memoList.childElementCount) {
          memoList.removeChild(memoList.children[0]);
        }

        for (const key of Object.keys(data)) {
          memoList.append(<option value={key}>{`${key}-${data[key]}`}</option>);
        }
      },
    },
  });
}

function apply() {
  const users = Parser.queryItems('users');
  const memos = getValue(USER_MEMO);

  users.forEach((user) => {
    const id = Parser.parseUserID(user);

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

  const articleView = Parser.queryView('article');
  if (!articleView || handlerApplied) return;

  handlerApplied = true;
  articleView.addEventListener('click', (event) => {
    if (event.target.closest('a')) return;

    const user = event.target.closest('.user-info');
    if (user == null) return;

    event.preventDefault();

    const id = Parser.parseUserID(user);
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
    apply();
  });
}
