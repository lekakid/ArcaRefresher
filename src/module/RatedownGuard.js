import Setting from '../core/Setting';

export default { initialize, apply };

const RATEDOWN_GUARD = 'blockRatedown';
const RATEDOWN_GUARD_DEFAULT = false;

function initialize() {
    const configElement = (
        <>
            <label class="col-md-3">비추천 방지</label>
            <div class="col-md-9">
                <select>
                    <option value="false">사용 안 함</option>
                    <option value="true">사용</option>
                </select>
                <p>비추천 버튼을 클릭하면 다시 한 번 확인창을 띄웁니다.</p>
            </div>
        </>
    );

    const selectElement = configElement.querySelector('select');

    function load() {
        const data = GM_getValue(RATEDOWN_GUARD, RATEDOWN_GUARD_DEFAULT);

        selectElement.value = data == 'true';
    }
    function save() {
        GM_setValue(RATEDOWN_GUARD, selectElement.value);
    }

    Setting.registConfig(configElement, 'utilityConfig', save, load);
}

function apply() {
    if(!GM_getValue(RATEDOWN_GUARD, RATEDOWN_GUARD_DEFAULT)) return;

    const ratedown = document.querySelector('#rateDown');
    if(ratedown == null) return;

    ratedown.addEventListener('click', e => {
        if(!confirm('비추천을 눌렀습니다.\n계속하시겠습니까?')) {
            e.preventDefault();
        }
    });
}
