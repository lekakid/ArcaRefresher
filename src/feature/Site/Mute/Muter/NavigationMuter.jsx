import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { NAVIGATION_LOADED, NAVIGATION_MENU } from 'core/selector';
import { useLoadChecker } from 'hooks/LoadChecker';

import { filterSelector } from '../selector';

function NavigationMuter() {
  const navLoaded = useLoadChecker(NAVIGATION_LOADED);

  const filter = useSelector(filterSelector);
  const navRef = useRef(null);

  // 채널 상단 메뉴 뮤트
  useEffect(() => {
    if (!navLoaded) return;

    if (!navRef.current)
      navRef.current = document.querySelector(NAVIGATION_MENU);

    const nav = navRef.current;
    const regex = new RegExp(filter.channel.join('|') || '(?!)');

    const muteChannel = () => {
      const channels = [
        ...nav.querySelectorAll('li.nav-item.dropdown a.dropdown-item'),
      ];
      channels.forEach((channel) => {
        const url = new URL(channel.href);
        const slug = url.pathname.split('/').pop();

        if (regex.test(slug)) {
          channel.style.display = 'none';
        }
      });
    };

    const unmuteChannel = () => {
      const channels = [
        ...nav.querySelectorAll('li.nav-item.dropdown a.dropdown-item'),
      ];
      channels.forEach((channel) => {
        channel.style.removeProperty('display');
      });
    };

    window.addEventListener('load', muteChannel);
    if (document.readyState === 'complete') muteChannel();
    return () => {
      window.removeEventListener('load', muteChannel);
      unmuteChannel();
    };
  }, [navLoaded, filter.channel]);

  return null;
}

export default NavigationMuter;
