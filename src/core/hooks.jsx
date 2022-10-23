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
 * @param {boolean} blockDisconnect 변화를 계속 추적할지 여부
 * @returns
 */
export function useElementQuery(
  selector,
  blockDisconnect = false,
  opt = defaultOpt,
) {
  const [exist, setExist] = useState(false);

  useEffect(() => {
    if (document.querySelector(selector)) {
      setExist(true);
      if (!blockDisconnect) return null;
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        if (!blockDisconnect) observer.disconnect();
        setExist(true);
        return;
      }
      setExist(false);
    });
    observer.observe(document.documentElement, opt);

    return () => observer.disconnect();
  }, [blockDisconnect, opt, selector]);

  return exist;
}
