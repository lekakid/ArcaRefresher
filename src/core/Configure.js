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
  get,
  set,
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

function addSetting(settingObject) {
  const { category, header, option, description, callback } = settingObject;
  const { save, load } = callback;

  const row = (
    <div className="row">
      <label className="col-md-3">{header}</label>
      <div className="col-md-9">
        {option}
        {description && <p>{description}</p>}
      </div>
    </div>
  );
  document.querySelector(`#refresherSetting #${category}`).append(row);
  saveCallbackList.push(save);
  loadCallbackList.push(load);
}

function importConfig(JSONString) {
  const data = JSON.parse(JSONString);

  // 임시 수정 설정 검증 루틴 필요
  for (const key of Object.keys(data)) {
    GM_setValue(key, data[key]);
  }
}

function exportConfig() {
  const keys = GM_listValues();
  const config = {};

  for (const key of keys) {
    config[key] = GM_getValue(key);
  }

  const result = JSON.stringify(config);
  return result;
}

function resetConfig() {
  const keys = GM_listValues();

  for (const key of keys) {
    GM_deleteValue(key);
  }
}

function initialize() {
  // 스크립트 설정 버튼 엘리먼트
  const showBtn = (
    <li className="nav-item dropdown" id="showSetting">
      <a aria-expanded="false" className="nav-link" href="#">
        <span className="d-none d-sm-block">스크립트 설정</span>
        <span className="d-block d-sm-none">
          <span className="ion-gear-a" />
        </span>
      </a>
    </li>
  );

  const contentWrapper = document.querySelector('.content-wrapper');
  const configContainer = (
    <div className="hidden clearfix" id="refresherSetting">
      <style>{stylesheet}</style>
      <div className="row">
        <div className="col-sm-0 col-md-2" />
        <div className="col-sm-12 col-md-8">
          <div className="dialog card">
            <div className="card-block">
              <h4 className="card-title">아카 리프레셔(Arca Refresher) 설정</h4>
              <div id="category" />
              <div className="row btns">
                <div className="col-12">
                  <a href="#" id="exportConfig" className="btn btn-primary">
                    설정 내보내기
                  </a>
                  <a href="#" id="importConfig" className="btn btn-secondary">
                    설정 가져오기
                  </a>
                  <a href="#" id="resetConfig" className="btn btn-danger">
                    설정 초기화
                  </a>
                </div>
              </div>
              <div className="row btns">
                <div className="col-12">
                  <a href="#" id="saveAndClose" className="btn btn-primary">
                    저장
                  </a>
                  <a href="#" id="closeSetting" className="btn btn-arca">
                    닫기
                  </a>
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
  for (const key of Object.keys(configCategoryString)) {
    categorySlot.append(
      <>
        <hr />
        <h5 className="card-title">{configCategoryString[key]}</h5>
        <div id={key} />
      </>
    );
  }

  // 설정 버튼 클릭 이벤트
  showBtn.addEventListener('click', () => {
    if (configContainer.classList.contains('hidden')) {
      for (const func of loadCallbackList) {
        func();
      }
      contentWrapper.classList.add('disappear');
    } else {
      configContainer.classList.add('disappear');
    }
  });

  // 애니메이션 처리
  contentWrapper.addEventListener('animationend', () => {
    if (contentWrapper.classList.contains('disappear')) {
      contentWrapper.classList.add('hidden');
      contentWrapper.classList.remove('disappear');
      configContainer.classList.add('appear');
      configContainer.classList.remove('hidden');
    } else if (contentWrapper.classList.contains('appear')) {
      contentWrapper.classList.remove('appear');
    }
  });
  configContainer.addEventListener('animationend', () => {
    if (configContainer.classList.contains('disappear')) {
      configContainer.classList.add('hidden');
      configContainer.classList.remove('disappear');
      contentWrapper.classList.add('appear');
      contentWrapper.classList.remove('hidden');
    } else if (configContainer.classList.contains('appear')) {
      configContainer.classList.remove('appear');
    }
  });

  // 엘리먼트 부착
  document.querySelector('ul.navbar-nav').append(showBtn);
  contentWrapper.insertAdjacentElement('afterend', configContainer);

  // 이벤트 핸들러
  configContainer.querySelector('#exportConfig').addEventListener('click', (event) => {
    event.preventDefault();

    const data = btoa(encodeURIComponent(exportConfig()));
    navigator.clipboard.writeText(data);
    alert('클립보드에 설정이 복사되었습니다.');
  });
  configContainer.querySelector('#importConfig').addEventListener('click', (event) => {
    event.preventDefault();

    let data = prompt('가져올 설정 데이터를 입력해주세요');
    if (data === null) return;
    try {
      if (data === '') throw '[Setting.importConfig] 공백 값을 입력했습니다.';
      data = decodeURIComponent(atob(data));
      importConfig(data);

      window.location.reload();
    } catch (error) {
      alert('올바르지 않은 데이터입니다.');
      console.error(error);
    }
  });
  configContainer.querySelector('#resetConfig').addEventListener('click', (event) => {
    event.preventDefault();

    if (!window.confirm('모든 설정이 초기화 됩니다. 계속하시겠습니까?')) return;

    resetConfig();
    window.location.reload();
  });
  configContainer.querySelector('#saveAndClose').addEventListener('click', (event) => {
    event.preventDefault();
    for (const func of saveCallbackList) {
      func();
    }

    window.location.reload();
  });
  configContainer.querySelector('#closeSetting').addEventListener('click', () => {
    configContainer.classList.add('disappear');
  });
}

function get({ key, defaultValue }) {
  if (Array.isArray(defaultValue)) {
    return GM_getValue(key, [...defaultValue]);
  }

  if (typeof defaultValue === 'object') {
    return GM_getValue(key, { ...defaultValue });
  }

  return GM_getValue(key, defaultValue);
}

function set({ key }, value) {
  GM_setValue(key, value);
}
