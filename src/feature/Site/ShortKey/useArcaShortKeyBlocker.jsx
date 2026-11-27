import { unsafeWindow } from '$';
import { useCallback } from 'react';

const keyBlockerRef = { current: () => false };

// 사이트의 단축키 등록이 되기 전에 패치
// 타 확장 프로그램 및 유저 스크립트의 경우 해당하지 않음
const proto = unsafeWindow.EventTarget.prototype;
const originalAdd = proto.addEventListener;
const originalRemove = proto.removeEventListener;

const EVENT_KEYS = new Set(['keydown', 'keypress', 'keyup']);
const wrapperMap = new WeakMap();

function wrap(listener) {
  let wrappedListener = wrapperMap.get(listener);
  if (wrappedListener) return wrappedListener;

  wrappedListener = function (e) {
    if (keyBlockerRef.current(e)) return;

    return typeof listener === 'function'
      ? listener.call(this, e)
      : listener.handleEvent(e);
  };

  wrapperMap.set(listener, wrappedListener);
  return wrappedListener;
}

const SITE_SCRIPT = /^https:\/\/([\w-]+\.)?arca\.live\//;

function getCallerUrl() {
  const frames = (new Error().stack || '')
    .split('\n')
    .map(
      (l) =>
        l.match(/(https?|chrome-extension|moz-extension):\/\/[^\s)]+/)?.[0],
    )
    .filter(Boolean);

  return frames[2] ?? '';
}

proto.addEventListener = function (type, listener, options) {
  if (EVENT_KEYS.has(type) && listener && SITE_SCRIPT.test(getCallerUrl())) {
    return originalAdd.call(this, type, wrap(listener), options);
  }
  return originalAdd.call(this, type, listener, options);
};
proto.removeEventListener = function (type, listener, options) {
  const wrappedListener = listener && wrapperMap.get(listener);
  return originalRemove.call(this, type, wrappedListener ?? listener, options);
};

export default function useArcaShortKeyBlocker() {
  const setter = useCallback((value) => {
    keyBlockerRef.current = typeof value === 'function' ? value : () => value;
  }, []);

  return setter;
}
