import { BOARD_LOADED } from '../core/ArcaSelector';
import { addAREventListener } from '../core/AREventHandler';
import { addSetting, getValue, setValue } from '../core/Configure';
import { waitForElement } from '../core/LoadManager';
import { parseUserID } from '../core/Parser';

export default { load };

const AUTO_REMOVE_USER = { key: 'autoRemoveUser', defaultValue: [] };
const AUTO_REMOVE_KEYWORD = { key: 'autoRemoveKeyword', defaultValue: [] };
const USE_AUTO_REMOVER_TEST = { key: 'useAutoRemoverTest', defaultValue: true };

async function load() {
  try {
    setupSetting();

    if (await waitForElement(BOARD_LOADED)) {
      addAREventListener('ArticleChange', {
        priority: 999,
        callback: remove,
      });
    }
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  const removeTestMode = (
    <select>
      <option value="false">사용 안 함</option>
      <option value="true">사용</option>
    </select>
  );
  const removeKeywordList = (
    <textarea rows="6" placeholder="확인 시 삭제할 키워드를 입력, 줄바꿈으로 구별합니다." />
  );
  const removeUserList = (
    <textarea rows="6" placeholder="확인 시 삭제할 작성자를 입력, 줄바꿈으로 구별합니다." />
  );

  addSetting({
    header: '자동 삭제',
    group: [
      {
        title: '테스트 모드',
        description: '게시물을 삭제하는 대신 어떤 게시물이 선택되는지 붉은색으로 보여줍니다.',
        content: removeTestMode,
      },
      {
        title: '키워드 목록',
        content: removeKeywordList,
        type: 'wide',
      },
      {
        title: '유저 목록',
        content: removeUserList,
        type: 'wide',
      },
    ],
    configHandler: {
      save() {
        setValue(USE_AUTO_REMOVER_TEST, removeTestMode.value === 'true');
        setValue(
          AUTO_REMOVE_KEYWORD,
          removeKeywordList.value.split('\n').filter((i) => i !== '')
        );
        setValue(
          AUTO_REMOVE_USER,
          removeUserList.value.split('\n').filter((i) => i !== '')
        );
      },
      load() {
        removeTestMode.value = getValue(USE_AUTO_REMOVER_TEST);
        removeKeywordList.value = getValue(AUTO_REMOVE_KEYWORD).join('\n');
        removeUserList.value = getValue(AUTO_REMOVE_USER).join('\n');
      },
    },
  });
}

function remove() {
  const form = document.querySelector('.batch-delete-form');
  if (form == null) return false;

  const userlist = getValue(AUTO_REMOVE_USER);
  const keywordlist = getValue(AUTO_REMOVE_KEYWORD);
  const testMode = getValue(USE_AUTO_REMOVER_TEST);

  const articles = document.querySelectorAll('a.vrow:not(.notice)');
  const articleid = [];

  articles.forEach((item) => {
    const titleElement = item.querySelector('.col-title');
    const userElement = item.querySelector('.user-info');
    if (!titleElement || !userElement) return;
    const title = titleElement.innerText;
    const author = parseUserID(userElement);
    const checkbox = item.querySelector('.batch-check');

    const authorAllow = userlist.length === 0 ? false : new RegExp(userlist.join('|')).test(author);
    const titleAllow =
      keywordlist.length === 0 ? false : new RegExp(keywordlist.join('|')).test(title);

    if (titleAllow || authorAllow) {
      if (testMode) {
        item.classList.add('target');
      } else {
        articleid.push(checkbox.getAttribute('data-id'));
      }
    }
  });

  if (articleid.length > 0 && !testMode) {
    form.querySelector('input[name="articleIds"]').value = articleid.join(',');
    form.submit();
    return true;
  }

  return false;
}
