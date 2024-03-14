import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { NAVIGATION_LOADED, NAVIGATION_MENU } from 'core/selector';
import { useLoadChecker } from 'hooks/LoadChecker';

import { filterSelector } from '../selector';

function NavigationMuter() {
  const navLoaded = useLoadChecker(NAVIGATION_LOADED);

  const filter = useSelector(filterSelector);
  const [nav, setNav] = useState(null);

  useEffect(() => {
    if (navLoaded) setNav(document.querySelector(NAVIGATION_MENU));
  }, [navLoaded]);

  // 이모티콘 뮤트
  useEffect(() => {
    if (!nav) return undefined;
    if (!(filter.channel?.length > 0)) return undefined;

    const muteChannel = () => {
      const channels = [
        ...nav.querySelectorAll('li.nav-item.dropdown a.dropdown-item'),
      ];
      const regex = new RegExp(filter.channel.join('|'));
      channels.forEach((channel) => {
        if (regex.test(channel.textContent.replace(' 채널', ''))) {
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

    if (document.readyState !== 'complete') {
      window.addEventListener('load', muteChannel);
      return () => {
        window.removeEventListener('load', muteChannel);
        unmuteChannel();
      };
    }

    muteChannel();
    return () => unmuteChannel();
  }, [nav, filter.channel]);

  return null;
}

export default NavigationMuter;
