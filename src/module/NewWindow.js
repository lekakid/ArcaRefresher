import { addSetting, getValue, setValue } from '../core/Configure';
import { CurrentPage } from '../core/Parser';
import AutoRefresher from './AutoRefresher';

export default { load };

const OPEN_NEW_WINDOW = { key: 'openNewWindow', defaultValue: false };

function load() {
  try {
    setupSetting();

    if (CurrentPage.Component.Board) {
      apply();
    }

    AutoRefresher.addRefreshCallback({
      priority: 100,
      callback: apply,
    });
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  const newWindow = (
    <select>
      <option value="false">사용 안 함</option>
      <option value="true">사용</option>
    </select>
  );
  addSetting({
    header: '새 창으로 열기',
    group: [
      {
        title: '게시물 클릭 시 새 창으로 열기',
        content: newWindow,
      },
    ],
    valueCallback: {
      save() {
        setValue(OPEN_NEW_WINDOW, newWindow.value === 'true');
      },
      load() {
        newWindow.value = getValue(OPEN_NEW_WINDOW);
      },
    },
  });
}

function apply() {
  const value = getValue(OPEN_NEW_WINDOW);
  if (!value) return;

  const articles = document.querySelectorAll('a.vrow:not(.notice-unfilter)');

  for (const article of articles) {
    article.setAttribute('target', '_blank');
  }
}
