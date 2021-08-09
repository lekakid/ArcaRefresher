import { useEffect, useState } from 'react';

const opt = {
  childList: true,
  subtree: true,
};

export default function useElementQuery(selector) {
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
