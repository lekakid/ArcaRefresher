/**
 * 설정 값을 가져옵니다.
 * @param {string}   key            키 값
 * @param {Object}   defaultValue   값이 없을 시 사용할 기본값
 * @param {function} formatUpdater  데이터 포맷 업데이트 함수
 * @return {Object}                 저장된 설정 값
 */
export function getValue(key, defaultValue, formatUpdater) {
  let value = GM_getValue(key);
  if (!value) return defaultValue ? { ...defaultValue } : null;

  const recentVersion = defaultValue?.version || 0;
  const valueVersion = value?.version || 0;
  if (formatUpdater && recentVersion > valueVersion) {
    value = formatUpdater(value);
    GM_setValue(`${key}_v${valueVersion}`);
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
