import { addSetting, getValue, setValue } from '../core/Configure';
import Parser from '../core/Parser';

export default { load };

const RATEDOWN_GUARD = { key: 'blockRatedown', defaultValue: false };

function load() {
  try {
    setupSetting();

    if (Parser.hasArticle()) {
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
    category: 'UTILITY',
    header: '비추천 방지',
    view: ratedownBlock,
    description: '비추천 버튼을 클릭하면 다시 한 번 확인창을 띄웁니다.',
    valueCallback: {
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
