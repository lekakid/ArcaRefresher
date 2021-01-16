import { useFade } from './Transition';

import stylesheet from '../css/Configure.css';

const CATEGORY = {
  UTILITY: {
    text: '유틸리티',
    wrapper: null,
    group: <div />,
  },
  INTERFACE: {
    text: '인터페이스',
    wrapper: null,
    group: <div />,
  },
  MEMO: {
    text: '메모',
    wrapper: null,
    group: <div />,
  },
  MUTE: {
    text: '뮤트',
    wrapper: null,
    group: <div />,
  },
  ADMIN: {
    text: '채널 관리자',
    wrapper: null,
    group: <div />,
  },
};

const saveCallbackList = [];
const loadCallbackList = [];

/**
 * 스크립트 설정 버튼을 누르면 나오는 설정창에 모듈의 설정을 추가해줍니다.
 * @param {Object} param                        파라미터 오브젝트
 * @param {string} param.category               설정이 위치할 분류
 * @param {string} param.header                 설정의 이름
 * @param {string} param.view                   사용자가 상호작용할 인터페이스
 * @param {string} [param.description]          하단에 표기되는 설명
 * @param {Object} param.valueCallback          콜백함수 오브젝트
 * @param {function} param.valueCallback.save   저장 버튼을 누를 시 호출할 콜백 함수
 * @param {function} param.valueCallback.load   불러오기 버튼을 누를 시 호출할 콜백 함수
 */
export function addSetting({ category, header, view, description, valueCallback: { save, load } }) {
  CATEGORY[category].group.append(
    <div className="row">
      <label className="col-md-3">{header}</label>
      <div className="col-md-9">
        {view}
        {description && <p>{description}</p>}
      </div>
    </div>
  );
  saveCallbackList.push(save);
  loadCallbackList.push(load);
}

/**
 * 설정 값을 가져옵니다.
 * @param {Object} keyObject           { key, defaultValue }
 * @param {string} keyObject.key       키 값
 * @param {*} keyObject.defaultValue   값이 없을 시 기본값
 * @return {*}                         저장된 설정 값
 */
export function getValue({ key, defaultValue }) {
  if (Array.isArray(defaultValue)) {
    return GM_getValue(key, [...defaultValue]);
  }

  if (typeof defaultValue === 'object') {
    return GM_getValue(key, { ...defaultValue });
  }

  return GM_getValue(key, defaultValue);
}

/**
 * 설정 값을 저장합니다.
 * @param {Object} param  { key, ...rest }
 * @param {*} value       저장할 값
 */
export function setValue({ key }, value) {
  GM_setValue(key, value);
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

function renderCategory() {
  const categoryArray = [];

  for (const key in CATEGORY) {
    if (CATEGORY[key]) {
      CATEGORY[key].wrapper = (
        <div>
          <h5 className="card-title">{CATEGORY[key].text}</h5>
          {CATEGORY[key].group}
        </div>
      );
      categoryArray.push(CATEGORY[key].wrapper);
    }
  }

  return categoryArray;
}

export default function initialize() {
  // 설정 버튼 엘리먼트
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
  showBtn.addEventListener('click', (event) => {
    event.preventDefault();
    toggleFunction();
    document.body.style.overflow = 'hidden';
    for (const func of loadCallbackList) {
      func();
    }
  });
  document.querySelector('ul.navbar-nav').append(showBtn);

  // 설정 메뉴 엘리먼트
  const configContainer = (
    <div id="refresherSetting">
      <style>{stylesheet}</style>
      <div className="settings">
        {renderCategory()}
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
  );
  const toggleFunction = useFade(configContainer);
  configContainer.addEventListener('click', (event) => {
    if (event.target.closest('.settings')) return;

    toggleFunction();
    document.body.style.overflow = '';
  });
  const contentWrapper = document.querySelector('.content-wrapper');
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
