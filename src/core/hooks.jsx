import { useEffect, useState } from 'react';
import { useDebounceCallback } from '@react-hook/debounce';

const opt = {
  childList: true,
  subtree: true,
};

export function useElementQuery(selector) {
  const [exist, setExist] = useState(false);

  useEffect(() => {
    if (document.querySelector(selector)) {
      setExist(true);
      return null;
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        setExist(true);
      }
    });
    observer.observe(document, opt);

    return () => observer.disconnect();
  }, [selector]);

  return exist;
}

export function useReduxDebounce(callback, wait = 300, leading = false) {
  return useDebounceCallback(callback, wait, leading);
}
