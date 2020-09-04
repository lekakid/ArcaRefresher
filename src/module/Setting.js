import styles, { stylesheet } from '../css/Setting.module.css';

export const defaultConfig = {
    refreshTime: 5,
    hideRefresher: false,
    useShortcut: false,
    hideNotice: false,
    hideAvatar: true,
    hideMedia: false,
    hideModified: false,
    hideSideMenu: false,
    myImage: '',
    filteredCategory: {},
    blockRatedown: false,
    blockKeyword: [],
    blockUser: [],
    blockEmoticon: {},
    userMemo: {},
    useAutoRemoverTest: true,
    autoRemoveUser: [],
    autoRemoveKeyword: [],
};

const defaultCategory = {
    전체: false,
    일반: false,
};

export function convert() {
    const oldData = GM_getValue('Setting', '');
    if(oldData == '') return;

    const data = JSON.parse(oldData);

    GM_setValue('refreshTime', parseInt(data.refreshTime, 10));
    GM_setValue('hideRefresher', data.hideRefresher);
    GM_setValue('useShortcut', data.useShortcut);
    GM_setValue('hideNotice', data.hideNotice);
    GM_setValue('hideAvatar', data.hideAvatar);
    GM_setValue('hideMedia', data.hideMedia);
    GM_setValue('hideModified', data.hideModified);
    GM_setValue('hideSideMenu', data.hideSideMenu);
    GM_setValue('myImage', data.myImage);
    GM_setValue('filteredCategory', data.filteredCategory);
    GM_setValue('blockRatedown', data.blockRatedown);
    GM_setValue('blockKeyword', data.blockKeyword);
    GM_setValue('blockUser', data.blockUser);
    GM_setValue('blockEmoticon', data.blockEmoticon);
    GM_setValue('userMemo', data.userMemo);
    GM_setValue('useAutoRemoverTest', data.useAutoRemoverTest);
    GM_setValue('autoRemoveUser', data.autoRemoveUser);
    GM_setValue('autoRemoveKeyword', data.autoRemoveKeyword);

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
        <li class="nav-item dropdown">
            <a aria-expanded="false" class="nav-link" href="#">
                <span class="hidden-sm-down">스크립트 설정</span>
                <span class="hidden-md-up"><span class="ion-gear-a" /></span>
            </a>
        </li>
    );

    // 설정 뷰
    const settingWrapper = (
        <div class={`${styles.wrapper} hidden clearfix`}>
            <div class="row">
                <div class="col-sm-0 col-md-2" />
                <div class="col-sm-12 col-md-8">
                    <div class="dialog card">
                        <form class="card-block">
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
                                    <p class="text-muted">일정 시간마다 게시물 목록을 갱신합니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">새로고침 애니메이션 숨김</label>
                                <div class="col-md-9">
                                    <select id="hideRefresher" data-type="bool">
                                        <option value="false">사용 안 함</option>
                                        <option value="true">사용</option>
                                    </select>
                                    <p class="text-muted">자동 새로고침 애니메이션을 숨깁니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">단축키 사용 (Beta)</label>
                                <div class="col-md-9">
                                    <select id="useShortcut" data-type="bool">
                                        <option value="false">사용 안 함</option>
                                        <option value="true">사용</option>
                                    </select>
                                    <p class="text-muted">
                                        채널 활동을 빠르게 할 수 있는 단축키를 사용합니다.<br />
                                        <a href="https://github.com/lekakid/ArcaRefresher/wiki/Feature#%EB%8B%A8%EC%B6%95%ED%82%A4%EB%A1%9C-%EB%B9%A0%EB%A5%B8-%EC%9D%B4%EB%8F%99" target="_blank" rel="noreferrer">
                                            단축키 안내 바로가기
                                        </a>
                                    </p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">비추천 방지</label>
                                <div class="col-md-9">
                                    <select id="blockRatedown" data-type="bool">
                                        <option value="false">사용 안 함</option>
                                        <option value="true">사용</option>
                                    </select>
                                    <p class="text-muted">비추천을 클릭하면 확인창을 띄웁니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">자짤 관리</label>
                                <div class="col-md-9">
                                    <a href="#" id="removeMyImage" class="btn btn-success">삭제</a>
                                    <p class="text-muted">등록된 자짤을 삭제합니다.</p>
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
                                    <p class="text-muted">베스트 라이브, 헤드라인 등 우측 사이드 메뉴를 숨깁니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">프로필 아바타</label>
                                <div class="col-md-9">
                                    <select id="hideAvatar" data-type="bool">
                                        <option value="false">보임</option>
                                        <option value="true">숨김</option>
                                    </select>
                                    <p class="text-muted">게시물 조회 시 프로필 아바타를 숨깁니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">본문 이미지, 동영상</label>
                                <div class="col-md-9">
                                    <select id="hideMedia" data-type="bool">
                                        <option value="false">보임</option>
                                        <option value="true">숨김</option>
                                    </select>
                                    <p class="text-muted">게시물 조회 시 본문에 나오는 이미지와 동영상을 숨깁니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">댓글 *수정됨</label>
                                <div class="col-md-9">
                                    <select id="hideModified" data-type="bool">
                                        <option value="false">보임</option>
                                        <option value="true">숨김</option>
                                    </select>
                                    <p class="text-muted">수정된 댓글의 수정됨 표기를 숨깁니다.</p>
                                </div>
                            </div>
                            <hr />
                            <h5 class="card-title">카테고리 기능</h5>
                            <div class="row">
                                <label class="col-md-3">미리보기 필터</label>
                                <div class="col-md-9">
                                    <div class="category-group">카테고리 목록을 확인할 수 없습니다. 채널 게시판에서 확인바랍니다.</div>
                                    <p class="text-muted">지정한 카테고리의 미리보기를 숨깁니다.</p>
                                </div>
                            </div>
                            <hr />
                            <h5 class="card-title">차단 기능</h5>
                            <div class="row">
                                <label class="col-md-3">유저 차단</label>
                                <div class="col-md-9">
                                    <textarea id="blockUser" rows="6" placeholder="차단할 이용자의 닉네임을 입력, 줄바꿈으로 구별합니다." />
                                    <p class="text-muted">지정한 유저의 게시물과 댓글을 차단합니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">키워드 차단</label>
                                <div class="col-md-9">
                                    <textarea id="blockKeyword" rows="6" placeholder="차단할 키워드를 입력, 줄바꿈으로 구별합니다." />
                                    <p class="text-muted">지정한 키워드가 포함된 제목을 가진 게시물과 댓글을 차단합니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">차단된 아카콘</label>
                                <div class="col-md-9">
                                    <select id="blockEmoticon" size="6" multiple />
                                    <div class="col-md-10">
                                        <p class="text-muted">차단된 아카콘 리스트입니다. 차단은 댓글에서 할 수 있습니다.</p>
                                    </div>
                                    <div class={`col-md-2 ${styles['align-right']} ${styles.fit}`}>
                                        <a href="#" id="removeEmoticon" class="btn btn-success">삭제</a>
                                    </div>
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
                                    <p class="text-muted">게시물을 삭제하지 않고 어떤 게시물이 선택되는지 붉은 색으로 보여줍니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">유저 게시물 삭제</label>
                                <div class="col-md-9">
                                    <textarea id="autoRemoveUser" rows="6" placeholder="대상 이용자를 줄바꿈으로 구별하여 입력합니다." />
                                    <p class="text-muted">지정한 유저의 게시물을 자동으로 삭제합니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">키워드 포함 게시물 삭제</label>
                                <div class="col-md-9">
                                    <textarea id="autoRemoveKeyword" rows="6" placeholder="삭제할 키워드를 입력, 줄바꿈으로 구별합니다." />
                                    <p class="text-muted">지정한 키워드가 포함된 제목을 가진 게시물을 삭제합니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <a href="#" id="resetSetting" class="btn btn-danger">설정 초기화</a>
                                </div>
                                <div class={`col-md-6 ${styles['align-right']}`}>
                                    <a href="#" id="saveAndClose" class="btn btn-primary">저장</a>
                                    <a href="#" id="closeSetting" class="btn btn-success">닫기</a>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
    const contentWrapper = document.querySelector('.content-wrapper');

    // 설정 버튼 클릭 이벤트
    showSettingBtn.addEventListener('click', () => {
        if(settingWrapper.classList.contains('hidden')) {
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

    // 설정 값 불러오기
    const comboElements = settingWrapper.querySelectorAll('select:not([multiple])');
    for(const element of comboElements) {
        element.value = GM_getValue(element.id, defaultConfig[element.id]);
    }
    const textElements = settingWrapper.querySelectorAll('textarea');
    for(const element of textElements) {
        element.value = GM_getValue(element.id, defaultConfig[element.id]).join('\n');
    }

    const blockEmoticon = GM_getValue('blockEmoticon', defaultConfig.blockEmoticon);
    const emoticonList = settingWrapper.querySelector('#blockEmoticon');
    for(const key in blockEmoticon) {
        if({}.hasOwnProperty.call(blockEmoticon, key)) {
            const opt = <option value="" />;
            opt.value = key;
            opt.textContent = `${blockEmoticon[key].name}`;
            emoticonList.append(opt);
        }
    }

    // 이벤트 핸들러
    settingWrapper.querySelector('#removeMyImage').addEventListener('click', event => {
        event.preventDefault();
        if(!confirm('등록한 자짤을 삭제하시겠습니까?')) return;

        GM_setValue('myImage', '');
        alert('삭제되었습니다.');
    });
    settingWrapper.querySelector('#removeEmoticon').addEventListener('click', event => {
        event.preventDefault();

        const removeItems = settingWrapper.querySelector('#blockEmoticon').selectedOptions;
        while(removeItems.length > 0) {
            removeItems[0].remove();
        }
    });
    settingWrapper.querySelector('#resetSetting').addEventListener('click', event => {
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
                value = element.split('\n');
                value = value.filter(item => {
                    return item != '';
                });
            }
            else {
                value = [];
            }
            GM_setValue(element.id, value);
        }

        const blockOptions = settingWrapper.querySelectorAll('#blockEmoticon option');
        const keys = [];
        blockOptions.forEach(item => {
            keys.push(item.value);
        });
        for(const key in blockEmoticon) {
            if(keys.indexOf(key) == -1) delete blockEmoticon[key];
        }
        GM_setValue('blockEmoticon', blockEmoticon);

        if(settingWrapper.querySelector('.category-group').textContent != '') {
            location.reload();
        }
    });
    settingWrapper.querySelector('#closeSetting').addEventListener('click', () => {
        settingWrapper.classList.add('disappear');
    });
}

export function setupCategory(channel) {
    const settingWrapper = document.querySelector(`.${styles.wrapper}`);
    const categoryGroup = settingWrapper.querySelector('.category-group');

    // 카테고리 버튼 등록
    categoryGroup.textContent = '';
    const categoryButton = <span><input type="checkbox" id="" /><label for="" /></span>;
    const category = document.querySelectorAll('.board-category a');

    categoryGroup.append(<span><input type="checkbox" id="전체" /><label for="전체">전체</label></span>);

    category.forEach(element => {
        const categoryName = (element.textContent == '전체') ? '일반' : element.textContent;
        const btn = categoryButton.cloneNode(true);
        btn.querySelector('input').id = categoryName;
        btn.querySelector('label').setAttribute('for', categoryName);
        btn.querySelector('label').textContent = categoryName;
        categoryGroup.append(btn);
    });

    // 카테고리 설정 불러오기
    const filteredCategory = GM_getValue('filteredCategory', defaultConfig.filteredCategory);
    if(filteredCategory[channel] == undefined) {
        filteredCategory[channel] = Object.assign({}, defaultCategory);
    }
    for(const key in filteredCategory[channel]) {
        if(filteredCategory[channel][key]) {
            const checkbox = document.getElementById(key);
            if(checkbox) checkbox.checked = true;
        }
    }

    // 이벤트 핸들러
    settingWrapper.querySelector('#saveAndClose').addEventListener('click', event => {
        event.preventDefault();

        const checkboxes = settingWrapper.querySelectorAll('.category-group input');
        checkboxes.forEach(element => {
            filteredCategory[channel][element.id] = element.checked;
        });
        GM_setValue('filteredCategory', filteredCategory);

        location.reload();
    });
}
