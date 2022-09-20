import React, { useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';

import { useParser } from 'util/Parser';
import Info from './FeatureInfo';

export default function ThemeCustomizer() {
  const { channel } = useParser();
  const { enabled, current, theme } = useSelector((state) => state[Info.ID]);

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
          ${Object.keys(currentTheme)
            .map((key) => `--color-${key}: ${currentTheme[key]} !important;`)
            .join('\n')}
        }
      `}
    </style>,
    document.head,
  );
}
