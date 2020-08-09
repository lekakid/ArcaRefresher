import styles, { stylesheet } from '../css/Setting.module.css';

const MIN_VERSION = '1.10.0';

const defaultData = {
    version: GM.info.script.version,
    refreshTime: 5,
    hideNotice: false,
    hideAvatar: true,
    hideMedia: false,
    hideModified: false,
    myImage: '',
    filteredCategory: {},
    blockKeyword: [],
    blockUser: [],
    blockEmoticon: {},
};

const defaultCategory = {
    전체: false,
    일반: false,
};

export async function load(channel) {
    let loadData = JSON.parse(await GM.getValue('Setting', '{}'));

    if(compareVersion(loadData.version, MIN_VERSION)) {
        loadData = defaultData;
    }
    else {
        loadData = Object.assign(defaultData, loadData);
    }

    if(loadData.filteredCategory[channel] == undefined) {
        loadData.filteredCategory[channel] = Object.assign({}, defaultCategory);
    }

    return loadData;
}

export function save(data) {
    GM.setValue('Setting', JSON.stringify(data));
}

function reset() {
    GM.setValue('Setting', '{}');
}

function compareVersion(a, b) {
    if(a == undefined) return true;

    const c = a.split('.');
    const d = b.split('.');

    for(let i = 0; i < a.length; i += 1) {
        if(parseInt(c[i], 10) > parseInt(d[i], 10)) break;
        else if(parseInt(c[i], 10) < parseInt(d[i], 10)) return true;
    }

    return false;
}

export function setup(channel, data) {
    const showSettingBtn = (
        <li class="nav-item dropdown">
            <a aria-expanded="false" class="nav-link" href="#">
                <span class="hidden-sm-down">스크립트 설정</span>
                <span class="hidden-md-up"><span class="ion-gear-a" /></span>
            </a>
        </li>
    );

    const settingWrapper = (
        <div class={`${styles.wrapper} hidden clearfix`}>
            <div class="row">
                <div class="col-sm-0 col-md-2" />
                <div class="col-sm-12 col-md-8">
                    <div class="dialog card">
                        <div calss="card-block">
                            <h4 class="card-title">아카 리프레셔(Arca Refresher) 설정</h4>
                            <div class="row">
                                <label class="col-xs-3">자동 새로고침</label>
                                <div class="col-xs-9">
                                    <select id="refreshTime">
                                        <option value="0">사용 안 함</option>
                                        <option value="3">3초</option>
                                        <option value="5">5초</option>
                                        <option value="10">10초</option>
                                    </select>
                                    <p class="text-muted">일정 시간마다 게시물 목록을 갱신합니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-xs-3">프로필 아바타 숨기기</label>
                                <div class="col-xs-9">
                                    <select id="hideAvatar">
                                        <option value="0">사용 안 함</option>
                                        <option value="1">사용</option>
                                    </select>
                                    <p class="text-muted">게시물 조회 시 프로필 아바타를 숨깁니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-xs-3">본문 이미지, 동영상 숨기기</label>
                                <div class="col-xs-9">
                                    <select id="hideMedia">
                                        <option value="0">사용 안 함</option>
                                        <option value="1">사용</option>
                                    </select>
                                    <p class="text-muted">게시물 조회 시 본문에 나오는 이미지와 동영상을 숨깁니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-xs-3">댓글 수정됨 표시 숨기기</label>
                                <div class="col-xs-9">
                                    <select id="hideModified">
                                        <option value="0">사용 안 함</option>
                                        <option value="1">사용</option>
                                    </select>
                                    <p class="text-muted">수정된 댓글의 수정됨 표기를 숨깁니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-xs-3">자짤 관리</label>
                                <div class="col-xs-9">
                                    <a href="#" id="removeMyImage" class="btn btn-success">삭제</a>
                                    <p class="text-muted">등록된 자짤을 삭제합니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-xs-3">미리보기 필터</label>
                                <div class="col-xs-9">
                                    <div class="category-group" />
                                    <p class="text-muted">지정한 카테고리의 미리보기를 숨깁니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-xs-3">유저 차단</label>
                                <div class="col-xs-9">
                                    <textarea id="blockUser" rows="6" placeholder="차단할 이용자의 닉네임을 입력, 줄바꿈으로 구별합니다." />
                                    <p class="text-muted">지정한 유저의 게시물과 댓글을 차단합니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-xs-3">키워드 차단</label>
                                <div class="col-xs-9">
                                    <textarea id="blockKeyword" rows="6" placeholder="차단할 키워드를 입력, 줄바꿈으로 구별합니다." />
                                    <p class="text-muted">지정한 키워드가 포함된 제목을 가진 게시물과 댓글을 차단합니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-xs-3">아카콘 차단</label>
                                <div class="col-xs-9">
                                    <select id="blockEmoticon" size="6" multiple />
                                    <div class="col-xs-10">
                                        <p class="text-muted">특정 아카콘을 차단합니다. 댓글에서 추가 가능합니다.</p>
                                    </div>
                                    <div class={`col-xs-2 ${styles['align-right']} ${styles.fit}`}>
                                        <a href="#" id="removeEmoticon" class="btn btn-success">삭제</a>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-6">
                                    <a href="#" id="resetSetting" class="btn btn-danger">설정 초기화</a>
                                </div>
                                <div class={`col-xs-6 ${styles['align-right']}`}>
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
    const categoryGroup = settingWrapper.querySelector('.category-group');

    showSettingBtn.addEventListener('click', () => {
        if(settingWrapper.classList.contains('hidden')) {
            contentWrapper.classList.add('disappear');
        }
        else {
            settingWrapper.classList.add('disappear');
        }
    });

    document.querySelector('ul.navbar-nav').append(showSettingBtn);

    document.head.append(<style>{ stylesheet }</style>);
    contentWrapper.parentNode.insertBefore(settingWrapper, document.querySelector('footer'));

    const categoryButton = <span><input type="checkbox" id="" /><label for="" /></span>;
    const category = document.querySelectorAll('.board-category a');

    categoryGroup.append(<span><input type="checkbox" id="전체" /><label for="전체">전체</label></span>);

    category.forEach(element => {
        const categoryName = (element.innerText == '전체') ? '일반' : element.innerText;
        const btn = categoryButton.cloneNode(true);
        btn.querySelector('input').id = categoryName;
        btn.querySelector('label').setAttribute('for', categoryName);
        btn.querySelector('label').innerText = categoryName;
        categoryGroup.append(btn);
    });

    contentWrapper.addEventListener('animationend', event => {
        if(event.target.classList.contains('disappear')) {
            event.target.classList.add('hidden');
            event.target.classList.remove('disappear');
            settingWrapper.classList.add('appear');
            settingWrapper.classList.remove('hidden');
        }
        else if(event.target.classList.contains('appear')) {
            event.target.classList.remove('appear');
        }
    });
    settingWrapper.addEventListener('animationend', event => {
        if(event.target.classList.contains('disappear')) {
            event.target.classList.add('hidden');
            event.target.classList.remove('disappear');
            contentWrapper.classList.add('appear');
            contentWrapper.classList.remove('hidden');
        }
        else if(event.target.classList.contains('appear')) {
            event.target.classList.remove('appear');
        }
    });

    settingWrapper.querySelector('#refreshTime').value = data.refreshTime;
    settingWrapper.querySelector('#hideAvatar').value = data.hideAvatar ? 1 : 0;
    settingWrapper.querySelector('#hideMedia').value = data.hideMedia ? 1 : 0;
    settingWrapper.querySelector('#hideModified').value = data.hideModified ? 1 : 0;
    settingWrapper.querySelector('#blockUser').value = data.blockUser.join('\n');
    settingWrapper.querySelector('#blockKeyword').value = data.blockKeyword.join('\n');
    for(const key in data.filteredCategory[channel]) {
        if(data.filteredCategory[channel][key]) {
            const checkbox = document.getElementById(key);
            if(checkbox) checkbox.checked = true;
        }
    }
    const emoticonList = settingWrapper.querySelector('#blockEmoticon');
    for(const key in data.blockEmoticon) {
        if({}.hasOwnProperty.call(data.blockEmoticon, key)) {
            const opt = <option value="" />;
            opt.value = key;
            opt.innerText = `${data.blockEmoticon[key].name}`;
            emoticonList.append(opt);
        }
    }

    settingWrapper.querySelector('#removeMyImage').addEventListener('click', event => {
        event.preventDefault();
        if(!confirm('등록한 자짤을 삭제하시겠습니까?')) return;

        data.myImage = '';
        save(data);
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

        data.refreshTime = settingWrapper.querySelector('#refreshTime').value;
        data.hideAvatar = settingWrapper.querySelector('#hideAvatar').value == 1;
        data.hideMedia = settingWrapper.querySelector('#hideMedia').value == 1;
        data.hideModified = settingWrapper.querySelector('#hideModified').value == 1;

        const checkboxes = settingWrapper.querySelectorAll('.category-group input');
        checkboxes.forEach(element => {
            data.filteredCategory[channel][element.id] = element.checked;
        });

        const blockUser = settingWrapper.querySelector('#blockUser').value;
        if(blockUser == '') {
            data.blockUser = [];
        }
        else {
            data.blockUser = blockUser.split('\n');
        }

        const blockKeyword = settingWrapper.querySelector('#blockKeyword').value;
        if(blockKeyword == '') {
            data.blockKeyword = [];
        }
        else {
            data.blockKeyword = blockKeyword.split('\n');
        }

        const tmp = {};
        const blockEmoticons = settingWrapper.querySelectorAll('#blockEmoticon option');
        blockEmoticons.forEach(item => {
            tmp[item.value] = data.blockEmoticon[item.value];
        });
        data.blockEmoticon = tmp;

        save(data);
        location.reload();
    });
    settingWrapper.querySelector('#closeSetting').addEventListener('click', () => {
        settingWrapper.classList.add('disappear');
    });
}
