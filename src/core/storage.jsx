import { createAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

/**
 * 설정 값을 가져옵니다.
 * @param {string}   key            키 값
 * @param {Object}   defaultValue   값이 없을 시 사용할 기본값
 * @param {function} updater        데이터 업데이트 함수
 * @return {Object}                 저장된 설정 값
 */
export function getValue(key, defaultValue, updater) {
  let value = GM_getValue(key);

  const targetVersion = defaultValue?.version || 0;
  const currentVersion = value?.version || 0;
  if (updater && targetVersion > currentVersion) {
    if (value) {
      GM_setValue(`${key}_v${currentVersion}`, value);
    }
    value = updater(value, defaultValue);
    GM_setValue(key, value);
  }

  return { ...defaultValue, ...value };
}

/**
 * 설정 값을 저장합니다.
 * @param {string} key    키 값
 * @param {*} value       저장할 값
 */
export function setValue(key, value) {
  GM_setValue(key, value);
}

/**
 * 설정 값을 지웁니다.
 * @param {string} key    키 값
 */
export function deleteValue(key) {
  GM_deleteValue(key);
}

/**
 * 설정 값을 string으로 반환합니다.
 */
export function exportValues() {
  const keys = GM_listValues();

  const data = keys.reduce(
    (acc, key) => ({ ...acc, [key]: GM_getValue(key) }),
    {},
  );

  return JSON.stringify(data);
}

/**
 * string으로 된 설정 값을 받아서 저장 합니다.
 */
export function importValues(JSONString) {
  const data = JSON.parse(JSONString);

  Object.entries(data).forEach(([key, value]) => {
    GM_setValue(key, value);
  });
}

/**
 * 모든 설정 값을 초기화합니다.
 */
export function resetValues() {
  const values = GM_listValues();

  values.forEach((v) => GM_deleteValue(v));
}

const INIT_MONKEY_SYNC = '!INIT_MONKEY_SYNC';

let blockedSync = false;
export function disableStorageSync() {
  blockedSync = true;
}

export function createMonkeySyncMiddleware() {
  const channel = new BroadcastChannel(`AR_SYNC_${GM_info.script.version}`);
  const currentWindowId = uuid();
  let initialized = false;

  return (store) => (next) => (action) => {
    // 버전이 다름 등으로 동기화 중단
    if (blockedSync) return next(action);

    if (!initialized) {
      channel.onmessage = ({ data: actionMessage }) => {
        // 현재 창이랑 같은 동기화 액션 무시
        if (actionMessage.$windowId === currentWindowId) return;

        // 동기화 액션 전파
        store.dispatch(actionMessage);
      };

      initialized = true;
      return next(action);
    }

    // BroadcastChannel에서 받은 액션 여부
    if (action.$windowId) return next(action);
    // 동기화가 되어야 하는 액션 여부
    if (!action.type.includes('/$')) return next(action);

    const result = next(action);
    const currentState = store.getState();

    // 저장소에 저장
    Object.entries(currentState).forEach(([key, value]) => {
      setValue(key, value.storage);
    });

    // BroadcastChannel로 동기화할 액션 전송
    const actionMessage = action;
    actionMessage.$windowId = currentWindowId;
    channel.postMessage(actionMessage);

    return result;
  };
}

const initMonkeySyncAction = createAction(INIT_MONKEY_SYNC);
export function initMonkeySync({ dispatch }) {
  dispatch(initMonkeySyncAction());
}
