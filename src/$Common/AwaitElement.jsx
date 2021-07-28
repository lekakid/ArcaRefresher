import { useCallback, useEffect } from 'react';

const opt = {
  childList: true,
  subtree: true,
};

export default function useAwaitElement(selector, callback) {
  const hookedCallback = useCallback(callback, []);
  useEffect(() => {
    if (document.querySelector(selector)) {
      hookedCallback();
      return null;
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        hookedCallback();
      }
    });
    observer.observe(document, opt);

    return () => observer.disconnect();
  }, [hookedCallback, selector]);
}
