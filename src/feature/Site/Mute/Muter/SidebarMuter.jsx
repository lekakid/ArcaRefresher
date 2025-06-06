import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';

import { FULL_LOADED } from 'core/selector';

import { useLoadChecker } from 'hooks/LoadChecker';
import { serializeText } from 'func/emoji';
import Info from '../FeatureInfo';

function SidebarMuter() {
  const fullLoaded = useLoadChecker(FULL_LOADED);

  const { keyword, hideMutedMark } = useSelector(
    (state) => state[Info.id].storage,
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
        const title = serializeText(e);

        if (!filter.test(title)) return;

        if (hideMutedMark) {
          e.style.display = 'none';
        }
        e.dataset.orig = e.innerHTML;
        e.dataset.href = e.href;
        e.textContent = '[뮤트됨]';
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
        e.innerHTML = e.dataset.orig;
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
