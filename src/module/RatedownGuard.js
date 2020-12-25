import Configure from '../core/Configure';

export default { addSetting, apply };

const RATEDOWN_GUARD = 'blockRatedown';

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
                GM_setValue(RATEDOWN_GUARD, ratedownBlock.value == 'true');
            },
            load() {
                ratedownBlock.value = GM_getValue(RATEDOWN_GUARD, false);
            },
        },
    });
}

function apply() {
    if(!GM_getValue(RATEDOWN_GUARD, false)) return;

    const ratedown = document.querySelector('#rateDown');
    if(ratedown == null) return;

    ratedown.addEventListener('click', e => {
        if(!confirm('비추천을 눌렀습니다.\n계속하시겠습니까?')) {
            e.preventDefault();
        }
    });
}
