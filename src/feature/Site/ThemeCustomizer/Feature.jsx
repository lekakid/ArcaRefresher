import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';

import Info from './FeatureInfo';
import store from 'core/store';

const pathToken = window.location.pathname.split('/');
pathToken.shift(); // ''
const pageType = pathToken.shift();
let channelId = pageType === 'b' ? pathToken.shift() : '';

const styleEl = document.createElement('style');
document.body.append(styleEl);

function applyTheme(storage) {
  const { enabled, current, theme } = storage;
  const currentTheme = theme[channelId] || theme[current];
  const on = enabled && !!currentTheme;

  styleEl.textContent = on
    ? `
          html.theme-custom { ${Object.entries(currentTheme)
            .map(([key, value]) => `--color-${key}: ${value} !important;`)
            .join('\n')}
          }
        `
    : '';

  document.documentElement.classList.toggle('theme-custom', on);
}
applyTheme(store.getState()[Info.id].storage);

export default function ThemeCustomizer() {
  const storage = useSelector((state) => state[Info.id].storage);

  const currentTheme =
    storage.theme[channelId] || storage.theme[storage.current];
  useLayoutEffect(() => {
    const on = storage.enabled && !!currentTheme;

    document.documentElement.classList.toggle('theme-custom', on);
    applyTheme(storage);

    return () => document.documentElement.classList.remove('theme-custom');
  }, [storage, currentTheme]);

  return null;
}
