import { createAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

/**
 * 설정 값을 가져옵니다.
 * @param {string}   key            키 값
 * @param {Object}   defaultValue   값이 없을 시 사용할 기본값
 * @param {function} formatUpdater  데이터 포맷 업데이트 함수
 * @return {Object}                 저장된 설정 값
 */
export function getValue(key, defaultValue, formatUpdater) {
  let value = GM_getValue(key);

  const targetVersion = defaultValue?.version || 0;
  const currentVersion = value?.version || 0;
  if (formatUpdater && targetVersion > currentVersion) {
    if (value) {
      GM_setValue(`${key}_v${currentVersion}`, value);
      value = formatUpdater(value, defaultValue);
      GM_setValue(key, value);
    }
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

let lastActionId;
const currentWindowId = uuid();
export function createMonkeySyncMiddleware() {
  const channel = new BroadcastChannel(`AR_SYNC_${GM_info.script.version}`);
  let initialized = false;

  return (store) => (next) => (action) => {
    if (blockedSync) return next(action);

    if (!initialized) {
      channel.onmessage = ({ data: actionMessage }) => {
        // 현재 창이랑 같은 동기화 액션 무시
        if (actionMessage.$windowId === currentWindowId) return;

        // 동기화된 액션
        if (
          actionMessage.$actionId &&
          actionMessage.$actionId !== lastActionId
        ) {
          lastActionId = actionMessage.$actionId;
          store.dispatch(actionMessage);
        }
      };
      initialized = true;
    }

    const prevState = store.getState();
    const result = next(action);

    // action.type = '{featureName}/${StorageAction}'
    if (action.type.indexOf('/$') > -1 && !action.$actionId) {
      const currentState = store.getState();

      Object.entries(currentState)
        .filter(([, value]) => !!value.storage)
        .forEach(([key, value]) => {
          if (prevState[key].storage !== value.storage)
            setValue(key, value.storage);
        });

      const actionMessage = action;
      actionMessage.$actionId = uuid();
      actionMessage.$windowId = currentWindowId;
      lastActionId = actionMessage.$actionId;
      channel.postMessage(actionMessage);
    }

    return result;
  };
}

const initMonkeySyncAction = createAction(INIT_MONKEY_SYNC);
export function initMonkeySync({ dispatch }) {
  dispatch(initMonkeySyncAction());
}
