import { ARTICLE_LOADED } from '../core/ArcaSelector';
import { addSetting, getValue, setValue } from '../core/Configure';
import { waitForElement } from '../core/LoadManager';

export default { load };

const RATEDOWN_GUARD = { key: 'blockRatedown', defaultValue: false };

async function load() {
  try {
    setupSetting();

    if (await waitForElement(ARTICLE_LOADED)) {
      apply();
    }
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  const ratedownBlock = (
    <select>
      <option value="false">사용 안 함</option>
      <option value="true">사용</option>
    </select>
  );
  addSetting({
    header: '비추천 방지',
    group: [
      {
        title: '비추천 버튼을 클릭하면 재확인창을 띄웁니다.',
        content: ratedownBlock,
      },
    ],
    configHandler: {
      save() {
        setValue(RATEDOWN_GUARD, ratedownBlock.value === 'true');
      },
      load() {
        ratedownBlock.value = getValue(RATEDOWN_GUARD);
      },
    },
  });
}

function apply() {
  if (!getValue(RATEDOWN_GUARD)) return;

  const ratedown = document.querySelector('#rateDown');
  if (ratedown == null) return;

  ratedown.addEventListener('click', (e) => {
    if (!window.confirm('비추천을 눌렀습니다.\n계속하시겠습니까?')) {
      e.preventDefault();
    }
  });
}
