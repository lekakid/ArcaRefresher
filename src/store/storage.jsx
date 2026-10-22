import { GM_deleteValue, GM_getValue, GM_listValues, GM_setValue } from '$';

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

  if (defaultValue === undefined) return value;
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
  flushPendingWrites();
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

  cancelPendingWrites();
  Object.entries(data).forEach(([key, value]) => {
    GM_setValue(key, value);
  });
}

/**
 * 모든 설정 값을 초기화합니다.
 */
export function resetValues() {
  cancelPendingWrites();
  const values = GM_listValues();

  values.forEach((v) => GM_deleteValue(v));
}

const pendingWrites = new Map();

let pageHidden = false;

function scheduleWrite(key, value) {
  clearTimeout(pendingWrites.get(key)?.timer);
  if (pageHidden) {
    pendingWrites.delete(key);
    setValue(key, value);
    return;
  }
  const timer = setTimeout(() => {
    pendingWrites.delete(key);
    setValue(key, value);
  }, 300);
  pendingWrites.set(key, { value, timer });
}

function flushPendingWrites() {
  pendingWrites.forEach(({ value, timer }, key) => {
    clearTimeout(timer);
    setValue(key, value);
  });
  pendingWrites.clear();
}

function cancelPendingWrites() {
  pendingWrites.forEach(({ timer }) => clearTimeout(timer));
  pendingWrites.clear();
}

let disabled = false;
export function disableStorageSync() {
  flushPendingWrites();
  disabled = true;
}

export function createMonkeySyncMiddleware() {
  const channel = new BroadcastChannel(`AR_SYNC_MONKEY`);
  const currentWindowId = crypto.randomUUID();

  const handleHide = () => {
    pageHidden = true;
    flushPendingWrites();
  };
  window.addEventListener('pagehide', handleHide);
  window.addEventListener('pageshow', () => {
    pageHidden = false;
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') handleHide();
    else pageHidden = false;
  });

  return (store) => {
    channel.onmessage = ({ data: actionMessage }) => {
      // 현재 창이랑 같은 동기화 액션 무시
      if (actionMessage.$windowId === currentWindowId) return;

      // 버전이 다름 등으로 동기화 중단
      if (disabled) return;

      // 동기화 액션 전파
      store.dispatch(actionMessage);

      const key = actionMessage.type.split('/')[0];
      const slice = store.getState()[key];
      if (pendingWrites.has(key) && slice?.storage) {
        scheduleWrite(key, slice.storage);
      }
    };

    return (next) => (action) => {
      // 버전이 다름 등으로 동기화 중단된 경우
      if (disabled) return next(action);

      // BroadcastChannel에서 받은 액션인 경우
      if (action.$windowId) return next(action);

      // $액션이 아닌 경우
      if (!action.type.includes('/$')) return next(action);

      const result = next(action);
      const currentState = store.getState();

      // 저장소에 저장
      const key = action.type.split('/')[0];
      const slice = currentState[key];
      if (slice?.storage) scheduleWrite(key, slice.storage);

      // BroadcastChannel로 동기화할 액션 전파
      const actionMessage = { ...action };
      actionMessage.$windowId = currentWindowId;
      channel.postMessage(actionMessage);

      return result;
    };
  };
}
