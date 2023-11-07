import { useLayoutEffect, useState } from 'react';

const loadTable = {};
const observer = new MutationObserver(() => {
  Object.keys(loadTable).forEach((selector) => {
    if (loadTable[selector].loaded) return;

    if (document.querySelector(selector)) {
      loadTable[selector].callbackList.forEach((cb) => cb());
      loadTable[selector].loaded = true;
    }
  });
});

observer.observe(document.documentElement, { childList: true, subtree: true });

export function useLoadChecker(targetSelector) {
  const [loaded, setLoaded] = useState(false);

  useLayoutEffect(() => {
    if (loadTable[targetSelector]?.loaded) {
      setLoaded(true);
      return;
    }

    const callback = () => setLoaded(true);
    if (loadTable[targetSelector]) {
      loadTable[targetSelector].callbackList.push(callback);
      return;
    }
    loadTable[targetSelector] = {
      loaded: false,
      callbackList: [callback],
    };
  }, [targetSelector]);

  return loaded;
}
