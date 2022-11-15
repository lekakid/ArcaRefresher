import React, { useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';

import { useContent } from 'util/ContentInfo';
import Info from './FeatureInfo';

export default function ThemeCustomizer() {
  const { channel } = useContent();
  const {
    storage: { enabled, current, theme },
  } = useSelector((state) => state[Info.ID]);

  const currentTheme = theme[channel.ID] || theme[current];
  useLayoutEffect(() => {
    if (!enabled || !currentTheme) return undefined;

    document.documentElement.classList.add('theme-custom');

    return () => document.documentElement.classList.remove('theme-custom');
  }, [currentTheme, enabled]);

  if (!enabled) return null;
  if (!currentTheme) return null;
  return ReactDOM.createPortal(
    <style>
      {`
        html.theme-custom {
          ${Object.entries(currentTheme)
            .map(([key, value]) => `--color-${key}: ${value} !important;`)
            .join('\n')}
        }
      `}
    </style>,
    document.head,
  );
}
