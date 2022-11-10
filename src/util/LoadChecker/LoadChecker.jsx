import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setFullfiled } from './slice';
import Info from './FeatureInfo';

export default function LoadChecker() {
  const dispatch = useDispatch();
  const { loadMap } = useSelector((state) => state[Info.ID]);

  useLayoutEffect(() => {
    const pendingList = Object.entries(loadMap).filter(([, load]) => !load);
    if (!pendingList.length) return undefined;

    pendingList.forEach(([s]) => {
      if (document.querySelector(s)) dispatch(setFullfiled(s));
    });

    const opt = {
      childList: true,
      subtree: true,
    };
    const observer = new MutationObserver(() => {
      pendingList.forEach(([s]) => {
        if (document.querySelector(s)) dispatch(setFullfiled(s));
      });
    });
    observer.observe(document.body, opt);

    return () => observer.disconnect();
  }, [dispatch, loadMap]);

  return null;
}
