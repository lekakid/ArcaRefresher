import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';

import { FULL_LOADED } from 'core/selector';

import { useLoadChecker } from 'hooks/LoadChecker';
import Info from '../FeatureInfo';

function SidebarMuter() {
  const fullLoaded = useLoadChecker(FULL_LOADED);

  const { keyword, hideMutedMark } = useSelector(
    (state) => state[Info.ID].storage,
  );

  useLayoutEffect(() => {
    if (!fullLoaded) return undefined;

    const mute = () => {
      const arcaKeyword = unsafeWindow.LiveConfig?.mute?.keywords || [];
      const filterList = [...arcaKeyword, ...keyword];
      if (!filterList.length) return;

      const filter = new RegExp(filterList.join('|'));

      const articles = document.querySelectorAll(
        '.right-sidebar .sidebar-item .link-list a',
      );
      articles.forEach((e) => {
        if (!filter.test(e.lastChild.textContent)) return;

        if (hideMutedMark) {
          e.style.display = 'none';
        }
        e.dataset.orig = e.lastChild.textContent;
        e.dataset.href = e.href;
        e.lastChild.textContent = '[뮤트됨]';
        e.removeAttribute('href');
      });
    };

    window.addEventListener('load', mute);
    if (document.readyState === 'complete') mute();

    return () => {
      window.removeEventListener('load', mute);
      const articles = document.querySelectorAll(
        '.right-sidebar .sidebar-item .link-list a[data-orig]',
      );
      articles.forEach((e) => {
        e.lastChild.textContent = e.dataset.orig;
        e.href = e.dataset.href;

        delete e.dataset.orig;
        delete e.dataset.href;
        e.style.removeProperty('display');
      });
    };
  }, [fullLoaded, hideMutedMark, keyword]);

  return null;
}

export default SidebarMuter;
