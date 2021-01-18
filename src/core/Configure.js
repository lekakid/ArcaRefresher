import { useFade } from './Transition';

import stylesheet from '../css/Configure.css';

const saveCallbackList = [];
const loadCallbackList = [];

const settingContainer = <div className="settings" />;
const settingList = [];

/**
 * 스크립트 설정 버튼을 누르면 나오는 설정창에 모듈의 설정을 추가해줍니다.
 * @param {Object} param                        파라미터 오브젝트
 * @param {string} param.header                 설정 그룹 이름
 * @param {Array} param.group                   설정 그룹
 * @param {Element} param.group.title           표기할 설정명
 * @param {Element} param.group.description     표기할 설정 부연설명
 * @param {Element} param.group.item            상호작용할 엘리먼트
 * @param {string} [param.group.type]           설정 표기 방식
 * @param {Object} param.valueCallback          콜백함수 오브젝트
 * @param {function} param.valueCallback.save   저장 버튼을 누를 시 호출할 콜백 함수
 * @param {function} param.valueCallback.load   불러오기 버튼을 누를 시 호출할 콜백 함수
 */
export function addSetting({ header, group, valueCallback: { save, load } }) {
  const row = (
    <div className="section">
      <h5>{header}</h5>
      <div className="group">
        {group.map(({ title, description, content, type }) => {
          const item = (
            <div className={`item ${type || 'default'}`}>
              {description && <p>{description}</p>}
              <label>{title}</label>
              <div>{content}</div>
            </div>
          );
          settingList.push({ title, description, item });
          return item;
        })}
      </div>
    </div>
  );
  saveCallbackList.push(save);
  loadCallbackList.push(load);

  settingContainer.append(row);
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
  function onSearch(event) {
    const value = event.target.value;
    if (value) {
      settingList.forEach(({ title, item }) => {
        if (title.indexOf(value) > -1) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    } else {
      settingList.forEach(({ item }) => {
        item.classList.remove('hidden');
      });
    }
  }
  function onSearchClick(event) {
    event.target.select();
  }
  function onExport() {
    const data = btoa(encodeURIComponent(exportConfig()));
    navigator.clipboard.writeText(data);
    alert('클립보드에 설정이 복사되었습니다.');
  }
  function onImport() {
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
  }
  function onReset() {
    if (!window.confirm('모든 설정이 초기화 됩니다. 계속하시겠습니까?')) return;

    resetConfig();
    window.location.reload();
  }
  function onSave() {
    for (const func of saveCallbackList) {
      func();
    }

    window.location.reload();
  }

  const configContainer = (
    <div id="refresherSetting">
      <style>{stylesheet}</style>
      <div className="background">
        <h4>Arca Refresher</h4>
        <div className="search">
          <input type="text" placeholder="설정 검색" onClick={onSearchClick} onInput={onSearch} />
        </div>
        {settingContainer}
        <div className="btn-grid">
          <button className="btn btn-primary" onClick={onExport}>
            내보내기
          </button>
          <button className="btn btn-secondary" onClick={onImport}>
            가져오기
          </button>
          <button className="btn btn-danger" onClick={onReset}>
            초기화
          </button>
          <button className="btn btn-arca" onClick={onSave}>
            저장
          </button>
        </div>
      </div>
    </div>
  );

  const toggleFunction = useFade(configContainer);
  configContainer.addEventListener('mousedown', (event) => {
    if (event.target.closest('.background')) return;

    toggleFunction();
    document.body.style.overflow = '';
  });
  const contentWrapper = document.querySelector('.content-wrapper');
  contentWrapper.insertAdjacentElement('afterend', configContainer);
}
