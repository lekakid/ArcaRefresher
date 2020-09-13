import { getContrastYIQ, getRandomColor } from './ColorManager';

import stylesheet from '../css/Setting.css';

export const defaultConfig = {
    refreshTime: 5,
    hideRefresher: false,
    useShortcut: false,
    hideNotice: false,
    hideAvatar: false,
    hideMedia: false,
    hideModified: false,
    hideSideMenu: false,
    myImage: '',
    blockRatedown: false,
    blockKeyword: [],
    blockUser: [],
    blockEmoticon: {},
    userMemo: {},
    useAutoRemoverTest: true,
    autoRemoveUser: [],
    autoRemoveKeyword: [],
    category: {},
};

export function convert() {
    const oldData = GM_getValue('Setting', '');
    if(oldData == '') return;

    const data = JSON.parse(oldData);

    for(const key of Object.keys(data)) {
        if({}.hasOwnProperty.call(defaultConfig, key)) {
            GM_setValue(key, data[key]);
        }
    }

    GM_deleteValue('Setting');
}

function reset() {
    const keys = GM_listValues();

    for(key of keys) {
        GM_deleteValue(keys);
    }
}

export function setup() {
    // 설정 CSS 등록
    document.head.append(<style>{ stylesheet }</style>);

    // 스크립트 설정 버튼 엘리먼트
    const showSettingBtn = (
        <li class="nav-item dropdown" id="showSetting">
            <a aria-expanded="false" class="nav-link" href="#">
                <span class="d-none d-sm-block">스크립트 설정</span>
                <span class="d-block d-sm-none"><span class="ion-gear-a" /></span>
            </a>
        </li>
    );

    // 설정 뷰
    const settingWrapper = (
        <div class="hidden clearfix" id="refresherSetting">
            <div class="row">
                <div class="col-sm-0 col-md-2" />
                <div class="col-sm-12 col-md-8">
                    <div class="dialog card">
                        <div class="card-block">
                            <h4 class="card-title">아카 리프레셔(Arca Refresher) 설정</h4>
                            <hr />
                            <h5 class="card-title">유틸리티</h5>
                            <div class="row">
                                <label class="col-md-3">자동 새로고침</label>
                                <div class="col-md-9">
                                    <select id="refreshTime" data-type="number">
                                        <option value="0">사용 안 함</option>
                                        <option value="3">3초</option>
                                        <option value="5">5초</option>
                                        <option value="10">10초</option>
                                    </select>
                                    <p>일정 시간마다 게시물 목록을 갱신합니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">새로고침 애니메이션 숨김</label>
                                <div class="col-md-9">
                                    <select id="hideRefresher" data-type="bool">
                                        <option value="false">사용 안 함</option>
                                        <option value="true">사용</option>
                                    </select>
                                    <p />
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">단축키 사용</label>
                                <div class="col-md-9">
                                    <select id="useShortcut" data-type="bool">
                                        <option value="false">사용 안 함</option>
                                        <option value="true">사용</option>
                                    </select>
                                    <p>
                                        <a href="https://github.com/lekakid/ArcaRefresher/wiki/Feature#%EB%8B%A8%EC%B6%95%ED%82%A4%EB%A1%9C-%EB%B9%A0%EB%A5%B8-%EC%9D%B4%EB%8F%99" target="_blank" rel="noreferrer">
                                            단축키 안내 바로가기
                                        </a>
                                    </p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">비추천 재확인 창</label>
                                <div class="col-md-9">
                                    <select id="blockRatedown" data-type="bool">
                                        <option value="false">사용 안 함</option>
                                        <option value="true">사용</option>
                                    </select>
                                    <p />
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">자짤 관리</label>
                                <div class="col-md-9">
                                    <button id="removeMyImage" class="btn btn-success">삭제</button>
                                    <p>게시물 조회 시 이미지 오른쪽 클릭 메뉴에서 관리합니다.</p>
                                </div>
                            </div>
                            <hr />
                            <h5 class="card-title">요소 숨김</h5>
                            <div class="row">
                                <label class="col-md-3">우측 사이드 메뉴</label>
                                <div class="col-md-9">
                                    <select id="hideSideMenu" data-type="bool">
                                        <option value="false">보임</option>
                                        <option value="true">숨김</option>
                                    </select>
                                    <p>베스트 라이브, 헤드라인 등 우측 사이드 메뉴를 숨깁니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">프로필 아바타</label>
                                <div class="col-md-9">
                                    <select id="hideAvatar" data-type="bool">
                                        <option value="false">보임</option>
                                        <option value="true">숨김</option>
                                    </select>
                                    <p>게시물 조회 시 프로필 아바타를 숨깁니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">본문 이미지, 동영상</label>
                                <div class="col-md-9">
                                    <select id="hideMedia" data-type="bool">
                                        <option value="false">보임</option>
                                        <option value="true">숨김</option>
                                    </select>
                                    <p>게시물 조회 시 본문에 나오는 이미지와 동영상을 숨깁니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">댓글 *수정됨</label>
                                <div class="col-md-9">
                                    <select id="hideModified" data-type="bool">
                                        <option value="false">보임</option>
                                        <option value="true">숨김</option>
                                    </select>
                                    <p>
                                        수정된 댓글의 수정됨 표기를 숨깁니다.<br />
                                        주의) 댓글 삭제 권한 보유 시 삭제됨 표기도 같이 숨겨집니다.
                                    </p>
                                </div>
                            </div>
                            <hr />
                            <h5 class="card-title">메모 기능</h5>
                            <div class="row">
                                <label class="col-md-3">메모된 이용자</label>
                                <div class="col-md-9">
                                    <select id="userMemo" size="6" multiple="" data-text-format="%key% - %value%" />
                                    <p>
                                        메모는 게시물 작성자, 댓글 작성자 아이콘(IP)을 클릭해 할 수 있습니다.<br />
                                        Ctrl, Shift, 마우스 드래그를 이용해서 여러개를 동시에 선택 할 수 있습니다.
                                    </p>
                                </div>
                            </div>
                            <hr />
                            <h5 class="card-title">채널 설정</h5>
                            <div class="row">
                                <label class="col-md-3">카테고리 설정</label>
                                <div class="col-md-9">
                                    <table class="table align-middle" id="categorySetting">
                                        <colgroup>
                                            <col width="20%" />
                                            <col width="20%" />
                                            <col width="60%" />
                                        </colgroup>
                                        <thead>
                                            <th>카테고리</th>
                                            <th>색상</th>
                                            <th>설정</th>
                                        </thead>
                                        <tbody />
                                    </table>
                                    <p>
                                        색상: 카테고리를 표시하는 색상을 변경합니다. 더블 클릭 시 무작위 색상이 지정됩니다.<br />
                                        미리보기 숨김: 마우스 오버 시 보여주는 미리보기를 제거합니다.<br />
                                        게시물 뮤트: 해당 카테고리가 포함된 게시물을 숨깁니다.
                                    </p>
                                </div>
                            </div>
                            <hr />
                            <h5 class="card-title">뮤트 기능</h5>
                            <div class="row">
                                <label class="col-md-3">사용자 뮤트</label>
                                <div class="col-md-9">
                                    <textarea id="blockUser" rows="6" placeholder="뮤트할 이용자의 닉네임을 입력, 줄바꿈으로 구별합니다." />
                                    <p>지정한 유저의 게시물과 댓글을 숨깁니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">키워드 뮤트</label>
                                <div class="col-md-9">
                                    <textarea id="blockKeyword" rows="6" placeholder="뮤트할 키워드를 입력, 줄바꿈으로 구별합니다." />
                                    <p>지정한 키워드가 포함된 제목을 가진 게시물과 댓글을 숨깁니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">뮤트된 아카콘</label>
                                <div class="col-md-9">
                                    <select id="blockEmoticon" size="6" multiple="" data-text-format="%name%" />
                                    <p>
                                        아카콘 뮤트는 댓글에서 할 수 있습니다.<br />
                                        Ctrl, Shift, 마우스 드래그를 이용해서 여러개를 동시에 선택 할 수 있습니다.
                                    </p>
                                </div>
                            </div>
                            <hr />
                            <h5 class="card-title">채널 관리자 전용</h5>
                            <div class="row">
                                <label class="col-md-3">삭제 테스트 모드</label>
                                <div class="col-md-9">
                                    <select id="useAutoRemoverTest" data-type="bool">
                                        <option value="false">사용 안 함</option>
                                        <option value="true">사용</option>
                                    </select>
                                    <p>게시물을 삭제하지 않고 어떤 게시물이 선택되는지 붉은 색으로 보여줍니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">유저 게시물 삭제</label>
                                <div class="col-md-9">
                                    <textarea id="autoRemoveUser" rows="6" placeholder="대상 이용자를 줄바꿈으로 구별하여 입력합니다." />
                                    <p>지정한 유저의 게시물을 자동으로 삭제합니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">키워드 포함 게시물 삭제</label>
                                <div class="col-md-9">
                                    <textarea id="autoRemoveKeyword" rows="6" placeholder="삭제할 키워드를 입력, 줄바꿈으로 구별합니다." />
                                    <p>지정한 키워드가 포함된 제목을 가진 게시물을 삭제합니다.</p>
                                </div>
                            </div>
                            <div class="row btns">
                                <div class="col-12">
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
    const contentWrapper = document.querySelector('.content-wrapper');

    // 설정 버튼 클릭 이벤트
    showSettingBtn.addEventListener('click', () => {
        if(settingWrapper.classList.contains('hidden')) {
            loadConfig();
            contentWrapper.classList.add('disappear');
        }
        else {
            settingWrapper.classList.add('disappear');
        }
    });

    // 애니메이션 처리
    contentWrapper.addEventListener('animationend', () => {
        if(contentWrapper.classList.contains('disappear')) {
            contentWrapper.classList.add('hidden');
            contentWrapper.classList.remove('disappear');
            settingWrapper.classList.add('appear');
            settingWrapper.classList.remove('hidden');
        }
        else if(contentWrapper.classList.contains('appear')) {
            contentWrapper.classList.remove('appear');
        }
    });
    settingWrapper.addEventListener('animationend', () => {
        if(settingWrapper.classList.contains('disappear')) {
            settingWrapper.classList.add('hidden');
            settingWrapper.classList.remove('disappear');
            contentWrapper.classList.add('appear');
            contentWrapper.classList.remove('hidden');
        }
        else if(settingWrapper.classList.contains('appear')) {
            settingWrapper.classList.remove('appear');
        }
    });

    // 헤더에 버튼 부착
    document.querySelector('ul.navbar-nav').append(showSettingBtn);
    contentWrapper.insertAdjacentElement('afterend', settingWrapper);

    const comboElements = settingWrapper.querySelectorAll('select:not([multiple])');
    const textElements = settingWrapper.querySelectorAll('textarea');
    const listElements = settingWrapper.querySelectorAll('select[multiple]');
    for(const element of listElements) {
        const btnElement = <button href="#" class="btn btn-success">삭제</button>;
        btnElement.addEventListener('click', event => {
            event.target.disabled = true;

            const removeElements = element.selectedOptions;
            while(removeElements.length > 0) removeElements[0].remove();

            event.target.disabled = false;
        });
        element.insertAdjacentElement('afterend', btnElement);
    }
    // 이벤트 핸들러
    settingWrapper.querySelector('#removeMyImage').addEventListener('click', event => {
        event.target.disabled = true;
        if(confirm('등록한 자짤을 삭제하시겠습니까?')) {
            GM_setValue('myImage', '');
            alert('삭제되었습니다.');
        }
        event.target.disabled = false;
    });
    settingWrapper.querySelector('#resetConfig').addEventListener('click', event => {
        event.preventDefault();

        if(!confirm('모든 설정이 초기화 됩니다. 계속하시겠습니까?')) return;

        reset();
        location.reload();
    });
    settingWrapper.querySelector('#saveAndClose').addEventListener('click', event => {
        event.preventDefault();

        for(const element of comboElements) {
            let value;
            switch(element.dataset.type) {
            case 'number':
                value = Number(element.value);
                break;
            case 'bool':
                value = element.value == 'true';
                break;
            default:
                value = null;
                break;
            }
            GM_setValue(element.id, value);
        }

        for(const element of textElements) {
            let value;
            if(element.value != '') {
                value = element.value.split('\n');
                value = value.filter(item => {
                    return item != '';
                });
            }
            else {
                value = [];
            }
            GM_setValue(element.id, value);
        }

        for(const element of listElements) {
            const data = GM_getValue(element.id, defaultConfig[element.id]);
            const options = element.querySelectorAll('option');
            const keys = Array.from(options, o => o.value);
            for(const key in data) {
                if(keys.indexOf(key) == -1) delete data[key];
            }
            GM_setValue(element.id, data);
        }

        if(settingWrapper.querySelector('#categorySetting tbody').childElementCount == 0) {
            location.reload();
        }
    });
    settingWrapper.querySelector('#closeSetting').addEventListener('click', () => {
        settingWrapper.classList.add('disappear');
    });
}

function loadConfig() {
    const settingWrapper = document.querySelector('#refresherSetting');

    // 설정 값 불러오기
    const comboElements = settingWrapper.querySelectorAll('select:not([multiple])');
    for(const element of comboElements) {
        element.value = GM_getValue(element.id, defaultConfig[element.id]);
    }
    const textElements = settingWrapper.querySelectorAll('textarea');
    for(const element of textElements) {
        element.value = GM_getValue(element.id, defaultConfig[element.id]).join('\n');
    }

    const listElements = settingWrapper.querySelectorAll('select[multiple]');
    for(const element of listElements) {
        if(element.childElementCount) {
            while(element.childElementCount) element.removeChild(element.firstChild);
        }
        const data = GM_getValue(element.id, defaultConfig[element.id]);
        for(const key of Object.keys(data)) {
            const option = <option />;
            option.value = key;

            const reservedWord = element.dataset.textFormat.match(/%\w*%/g);
            let text = element.dataset.textFormat;
            if(text != '') {
                for(const word of reservedWord) {
                    switch(word) {
                    case '%key%':
                        text = text.replace(word, key);
                        break;
                    case '%value%':
                        text = text.replace(word, data[key]);
                        break;
                    default:
                        text = text.replace(word, data[key][word.replace(/%/g, '')]);
                        break;
                    }
                }
            }
            else {
                text = key;
            }
            option.textContent = text;
            element.append(option);
        }
    }
}

export function setupCategory(channel) {
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
                {name == '일반' && <td><input type="text" name="color" placeholder="000000" disabled /></td>}
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
        const regex = /[0-9a-f]/;
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

        const categoryConfig = GM_getValue('category', defaultConfig.category);
        const rows = settingWrapper.querySelectorAll('#categorySetting tr');
        if(categoryConfig[channel] == undefined) {
            categoryConfig[channel] = {};
        }

        for(const row of rows) {
            if(categoryConfig[channel][row.id] == undefined) {
                categoryConfig[channel][row.id] = {};
            }
            categoryConfig[channel][row.id].color = row.querySelector('[name="color"]').value;
            categoryConfig[channel][row.id].blockPreview = row.querySelector('[name="blockPreview"]').checked;
            categoryConfig[channel][row.id].blockArticle = row.querySelector('[name="blockArticle"]').checked;
        }

        GM_setValue('category', categoryConfig);

        location.reload();
    });
}

function loadCategoryConfig(channel) {
    // 카테고리 설정 불러오기
    const categoryConfig = GM_getValue('category', defaultConfig.category);
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
