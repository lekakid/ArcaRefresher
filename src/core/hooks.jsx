import { useEffect, useState } from 'react';

const defaultOpt = {
  childList: true,
  subtree: true,
};

/**
 * useElementQuery
 * selector로 받은 엘리먼트가 감지될 때까지 화면 변화를 감지합니다.
 *
 * @param {string} selector 찾을 엘리먼트의 설렉터
 * @param {Object} opt      옵저버 옵션
 * @returns
 */
export function useElementQuery(selector, opt = defaultOpt) {
  const [exist, setExist] = useState(false);

  useEffect(() => {
    if (document.querySelector(selector)) {
      setExist(true);
      return undefined;
    }

    const observer = new MutationObserver(() => {
      if (!document.querySelector(selector)) return;

      observer.disconnect();
      setExist(true);
    });
    observer.observe(document.documentElement, opt);

    return () => observer.disconnect();
  }, [opt, selector]);

  return exist;
}
