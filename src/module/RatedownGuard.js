import Configure from '../core/Configure';
import Parser from '../core/Parser';

export default { load };

const RATEDOWN_GUARD = { key: 'blockRatedown', defaultValue: false };

function load() {
  try {
    addSetting();

    if (Parser.hasArticle()) {
      apply();
    }
  } catch (error) {
    console.error(error);
  }
}

function addSetting() {
  const ratedownBlock = (
    <select>
      <option value="false">사용 안 함</option>
      <option value="true">사용</option>
    </select>
  );
  Configure.addSetting({
    category: Configure.categoryKey.UTILITY,
    header: '비추천 방지',
    option: ratedownBlock,
    description: '비추천 버튼을 클릭하면 다시 한 번 확인창을 띄웁니다.',
    callback: {
      save() {
        Configure.set(RATEDOWN_GUARD, ratedownBlock.value === 'true');
      },
      load() {
        ratedownBlock.value = Configure.get(RATEDOWN_GUARD);
      },
    },
  });
}

function apply() {
  if (!Configure.get(RATEDOWN_GUARD)) return;

  const ratedown = document.querySelector('#rateDown');
  if (ratedown == null) return;

  ratedown.addEventListener('click', (e) => {
    if (!window.confirm('비추천을 눌렀습니다.\n계속하시겠습니까?')) {
      e.preventDefault();
    }
  });
}
