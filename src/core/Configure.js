import stylesheet from '../css/Configure.css';

const categoryKey = {
    UTILITY: 'utility',
    INTERFACE: 'interface',
    MEMO: 'memo',
    MUTE: 'mute',
    CHANNEL_ADMIN: 'channelAdmin',
};

export default {
    categoryKey,
    initialize,
    addSetting,
};

const configCategoryString = {
    utility: '유틸리티',
    interface: '인터페이스 변경',
    memo: '메모 관리',
    mute: '뮤트 설정',
    channelAdmin: '채널 관리자 기능',
};

const saveCallbackList = [];
const loadCallbackList = [];

function addSetting(element, category, saveCallback, loadCallback) {
    const row = (
        <div class="row">
            {element}
        </div>
    );
    document.querySelector(`#refresherSetting #${category}`).append(row);
    saveCallbackList.push(saveCallback);
    loadCallbackList.push(loadCallback);
}

function importConfig(JSONString) {
    const data = JSON.parse(JSONString);

    // 임시 수정 설정 검증 루틴 필요
    for(const key of Object.keys(data)) {
        GM_setValue(key, data[key]);
    }
}

function exportConfig() {
    const keys = GM_listValues();
    const config = {};

    for(const key of keys) {
        config[key] = GM_getValue(key);
    }

    const result = JSON.stringify(config);
    return result;
}

function resetConfig() {
    const keys = GM_listValues();

    for(const key of keys) {
        GM_deleteValue(key);
    }
}

function initialize() {
    // 스크립트 설정 버튼 엘리먼트
    const showBtn = (
        <li class="nav-item dropdown" id="showSetting">
            <a aria-expanded="false" class="nav-link" href="#">
                <span class="d-none d-sm-block">스크립트 설정</span>
                <span class="d-block d-sm-none"><span class="ion-gear-a" /></span>
            </a>
        </li>
    );

    const contentWrapper = document.querySelector('.content-wrapper');
    const configContainer = (
        <div class="hidden clearfix" id="refresherSetting">
            <style>{stylesheet}</style>
            <div class="row">
                <div class="col-sm-0 col-md-2" />
                <div class="col-sm-12 col-md-8">
                    <div class="dialog card">
                        <div class="card-block">
                            <h4 class="card-title">아카 리프레셔(Arca Refresher) 설정</h4>
                            <div id="category" />
                            <div class="row btns">
                                <div class="col-12">
                                    <a href="#" id="exportConfig" class="btn btn-primary">설정 내보내기</a>
                                    <a href="#" id="importConfig" class="btn btn-secondary">설정 가져오기</a>
                                    <a href="#" id="resetConfig" class="btn btn-danger">설정 초기화</a>
                                </div>
                            </div>
                            <div class="row btns">
                                <div class="col-12">
                                    <a href="#" id="saveAndClose" class="btn btn-primary">저장</a>
                                    <a href="#" id="closeSetting" class="btn btn-success">닫기</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // 설정 카테고리 생성
    const categorySlot = configContainer.querySelector('#category');
    for(const key of Object.keys(configCategoryString)) {
        categorySlot.append((
            <>
                <hr />
                <h5 class="card-title">{configCategoryString[key]}</h5>
                <div id={key} />
            </>
        ));
    }

    // 설정 버튼 클릭 이벤트
    showBtn.addEventListener('click', () => {
        if(configContainer.classList.contains('hidden')) {
            for(const func of loadCallbackList) {
                func();
            }
            contentWrapper.classList.add('disappear');
        }
        else {
            configContainer.classList.add('disappear');
        }
    });

    // 애니메이션 처리
    contentWrapper.addEventListener('animationend', () => {
        if(contentWrapper.classList.contains('disappear')) {
            contentWrapper.classList.add('hidden');
            contentWrapper.classList.remove('disappear');
            configContainer.classList.add('appear');
            configContainer.classList.remove('hidden');
        }
        else if(contentWrapper.classList.contains('appear')) {
            contentWrapper.classList.remove('appear');
        }
    });
    configContainer.addEventListener('animationend', () => {
        if(configContainer.classList.contains('disappear')) {
            configContainer.classList.add('hidden');
            configContainer.classList.remove('disappear');
            contentWrapper.classList.add('appear');
            contentWrapper.classList.remove('hidden');
        }
        else if(configContainer.classList.contains('appear')) {
            configContainer.classList.remove('appear');
        }
    });

    // 엘리먼트 부착
    document.querySelector('ul.navbar-nav').append(showBtn);
    contentWrapper.insertAdjacentElement('afterend', configContainer);

    // 이벤트 핸들러
    configContainer.querySelector('#exportConfig').addEventListener('click', event => {
        event.preventDefault();

        const data = btoa(encodeURIComponent(exportConfig()));
        navigator.clipboard.writeText(data);
        alert('클립보드에 설정이 복사되었습니다.');
    });
    configContainer.querySelector('#importConfig').addEventListener('click', event => {
        event.preventDefault();

        let data = prompt('가져올 설정 데이터를 입력해주세요');
        if(data == null) return;
        try {
            if(data == '') throw '[Setting.importConfig] 공백 값을 입력했습니다.';
            data = decodeURIComponent(atob(data));
            importConfig(data);

            location.reload();
        }
        catch (error) {
            alert('올바르지 않은 데이터입니다.');
            console.error(error);
        }
    });
    configContainer.querySelector('#resetConfig').addEventListener('click', event => {
        event.preventDefault();

        if(!confirm('모든 설정이 초기화 됩니다. 계속하시겠습니까?')) return;

        resetConfig();
        location.reload();
    });
    configContainer.querySelector('#saveAndClose').addEventListener('click', event => {
        event.preventDefault();
        for(const func of saveCallbackList) {
            func();
        }

        location.reload();
    });
    configContainer.querySelector('#closeSetting').addEventListener('click', () => {
        configContainer.classList.add('disappear');
    });
}
