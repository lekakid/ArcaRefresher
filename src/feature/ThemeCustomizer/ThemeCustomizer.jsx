import React, { useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';

import { useParser } from 'util/Parser';
import { MODULE_ID } from './ModuleInfo';

export default function ThemeCustomizer() {
  const { channelID } = useParser();
  const { enabled, current, theme } = useSelector((state) => state[MODULE_ID]);

  const currentTheme = theme[channelID] || theme[current];
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
