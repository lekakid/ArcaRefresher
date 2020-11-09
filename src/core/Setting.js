import stylesheet from '../css/Setting.css';

export default {
    initialize,
    registConfig,
};

const saveCallbackList = [];
const loadCallbackList = [];

function registConfig(settingElement, category, saveCallback, loadCallback) {
    const element = (
        <div class="row">
            {settingElement}
        </div>
    );
    document.querySelector(`#refresherSetting #${category}`).append(element);
    saveCallbackList.push(saveCallback);
    loadCallbackList.push(loadCallback);
}

function importConfig(JSONString) {
    const data = JSON.parse(JSONString);

    for(const key of Object.keys(data)) {
        if({}.hasOwnProperty.call(configData, key)) {
            GM_setValue(key, data[key]);
        }
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
    const settingContainer = (
        <div class="hidden clearfix" id="refresherSetting">
            <style>{stylesheet}</style>
            <div class="row">
                <div class="col-sm-0 col-md-2" />
                <div class="col-sm-12 col-md-8">
                    <div class="dialog card">
                        <div class="card-block">
                            <h4 class="card-title">아카 리프레셔(Arca Refresher) 설정</h4>
                            <hr />
                            <h5 class="card-title">유틸리티</h5>
                            <div id="utilityConfig" />
                            <hr />
                            <h5 class="card-title">요소 관리</h5>
                            <div id="elementConfig" />
                            <hr />
                            <h5 class="card-title">메모 관리</h5>
                            <div id="memoConfig" />
                            <hr />
                            <h5 class="card-title">카테고리 설정</h5>
                            <div id="categoryConfig" />
                            <hr />
                            <h5 class="card-title">뮤트 설정</h5>
                            <div id="muteConfig" />
                            <hr />
                            <h5 class="card-title">채널 관리자 기능</h5>
                            <div id="channelAdminConfig" />
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

    // 설정 버튼 클릭 이벤트
    showBtn.addEventListener('click', () => {
        if(settingContainer.classList.contains('hidden')) {
            for(const func of loadCallbackList) {
                func();
            }
            contentWrapper.classList.add('disappear');
        }
        else {
            settingContainer.classList.add('disappear');
        }
    });

    // 애니메이션 처리
    contentWrapper.addEventListener('animationend', () => {
        if(contentWrapper.classList.contains('disappear')) {
            contentWrapper.classList.add('hidden');
            contentWrapper.classList.remove('disappear');
            settingContainer.classList.add('appear');
            settingContainer.classList.remove('hidden');
        }
        else if(contentWrapper.classList.contains('appear')) {
            contentWrapper.classList.remove('appear');
        }
    });
    settingContainer.addEventListener('animationend', () => {
        if(settingContainer.classList.contains('disappear')) {
            settingContainer.classList.add('hidden');
            settingContainer.classList.remove('disappear');
            contentWrapper.classList.add('appear');
            contentWrapper.classList.remove('hidden');
        }
        else if(settingContainer.classList.contains('appear')) {
            settingContainer.classList.remove('appear');
        }
    });

    // 엘리먼트 부착
    document.querySelector('ul.navbar-nav').append(showBtn);
    contentWrapper.insertAdjacentElement('afterend', settingContainer);

    // 이벤트 핸들러
    settingContainer.querySelector('#exportConfig').addEventListener('click', event => {
        event.preventDefault();

        const data = btoa(encodeURIComponent(exportConfig()));
        navigator.clipboard.writeText(data);
        alert('클립보드에 설정이 복사되었습니다.');
    });
    settingContainer.querySelector('#importConfig').addEventListener('click', event => {
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
    settingContainer.querySelector('#resetConfig').addEventListener('click', event => {
        event.preventDefault();

        if(!confirm('모든 설정이 초기화 됩니다. 계속하시겠습니까?')) return;

        resetConfig();
        location.reload();
    });
    settingContainer.querySelector('#saveAndClose').addEventListener('click', event => {
        event.preventDefault();
        for(const func of saveCallbackList) {
            func();
        }

        location.reload();
    });
    settingContainer.querySelector('#closeSetting').addEventListener('click', () => {
        settingContainer.classList.add('disappear');
    });
}

/*
function setupCategory(channel) {
    const settingWrapper = document.querySelector('#refresherSetting');
    const showSettingBtn = document.getElementById('showSetting');
    const categoryTable = settingWrapper.querySelector('#categorySetting tbody');

    // 설정 버튼 클릭 이벤트
    showSettingBtn.addEventListener('click', () => {
        if(settingWrapper.classList.contains('hidden')) {
            loadCategoryConfig(channel);
        }
    });

    // 카테고리 목록 등록
    const boardCategoryElements = document.querySelectorAll('.board-category a');

    for(const element of boardCategoryElements) {
        const name = element.textContent == '전체' ? '일반' : element.textContent;
        const tableCategoryElement = (
            <tr id={name}>
                <td>{name}</td>
                {name == '일반' && <td><input type="text" name="color" placeholder="000000" disabled="" /></td>}
                {name != '일반' && <td><input type="text" name="color" placeholder="000000" maxlength="6" /></td>}
                <td>
                    <label><input type="checkbox" name="blockPreview" /><span> 미리보기 숨김 </span></label>
                    <label><input type="checkbox" name="blockArticle" /><span> 게시물 뮤트 </span></label>
                </td>
            </tr>
        );
        categoryTable.append(tableCategoryElement);
    }

    // 이벤트 핸들러
    categoryTable.addEventListener('keypress', event => {
        const regex = /[0-9a-fA-F]/;
        if(!regex.test(event.key)) event.preventDefault();
    });
    categoryTable.addEventListener('dblclick', event => {
        if(event.target.name != 'color') return;
        if(event.target.disabled) return;

        const color = getRandomColor();
        event.target.value = color;
        event.target.style.backgroundColor = `#${color}`;
        event.target.style.color = getContrastYIQ(color);
    });
    categoryTable.addEventListener('input', event => {
        if(event.target.value.length == 6 || event.target.value.length == 3) {
            const color = event.target.value;
            const textColor = getContrastYIQ(color);

            event.target.style.backgroundColor = `#${color}`;
            event.target.style.color = textColor;
        }
        else {
            event.target.style.backgroundColor = '';
            event.target.style.color = '';
        }
    });
    settingWrapper.querySelector('#saveAndClose').addEventListener('click', event => {
        event.preventDefault();

        const categoryConfig = GM_getValue('category', DefaultConfig.category);
        const rows = settingWrapper.querySelectorAll('#categorySetting tr');
        if(categoryConfig[channel] == undefined) {
            categoryConfig[channel] = {};
        }

        for(const row of rows) {
            if(categoryConfig[channel][row.id] == undefined) {
                categoryConfig[channel][row.id] = {};
            }
            categoryConfig[channel][row.id].color = row.querySelector('[name="color"]').value.toUpperCase();
            categoryConfig[channel][row.id].blockPreview = row.querySelector('[name="blockPreview"]').checked;
            categoryConfig[channel][row.id].blockArticle = row.querySelector('[name="blockArticle"]').checked;
        }

        GM_setValue('category', categoryConfig);

        location.reload();
    });
}

function loadCategoryConfig(channel) {
    // 카테고리 설정 불러오기
    const categoryConfig = GM_getValue('category', DefaultConfig.category);
    if(categoryConfig[channel] == undefined) {
        categoryConfig[channel] = {};
    }

    for(const key of Object.keys(categoryConfig[channel])) {
        const row = document.getElementById(key);
        if(row) {
            const colorInput = row.querySelector('[name="color"]');
            colorInput.value = categoryConfig[channel][key].color;
            if(categoryConfig[channel][key].color == '') {
                colorInput.style.backgroundColor = '';
                colorInput.style.color = '';
            }
            else {
                colorInput.style.backgroundColor = `#${categoryConfig[channel][key].color}`;
                colorInput.style.color = getContrastYIQ(categoryConfig[channel][key].color);
            }
            row.querySelector('[name="blockPreview"]').checked = categoryConfig[channel][key].blockPreview;
            row.querySelector('[name="blockArticle"]').checked = categoryConfig[channel][key].blockArticle;
        }
    }
}
*/
