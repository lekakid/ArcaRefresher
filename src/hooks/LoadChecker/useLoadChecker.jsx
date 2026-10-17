import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import store from 'core/store';

import hookInfo from './hookInfo';
import { setLoaded } from './slice';

const selectorSet = new Set();

const observer = new MutationObserver(() => {
  const done = [];

  selectorSet.forEach((s) => {
    if (!document.querySelector(s)) return;

    store.dispatch(setLoaded(s));
    done.push(s);
  });
  done.forEach((s) => selectorSet.delete(s));
});
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

export default function useLoadChecker(targetSelector) {
  const dispatch = useDispatch();
  const loaded = useSelector((state) => !!state[hookInfo.id]?.[targetSelector]);

  useLayoutEffect(() => {
    // Mutation 셋업 단계에서 이미 로드 된 경우
    if (loaded) return;

    // 셋업 전 document 검사
    if (document.querySelector(targetSelector)) {
      dispatch(setLoaded(targetSelector));
      return;
    }

    // 검사할 설렉터 등록
    selectorSet.add(targetSelector);
  }, [loaded, targetSelector, dispatch]);

  return loaded || !!document.querySelector(targetSelector);
}
