import React, { useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';

import { BOARD_ITEMS, BOARD, BOARD_IN_ARTICLE } from 'core/selector';
import { EVENT_BOARD_REFRESH, useEvent } from 'hooks/Event';
import { useContent } from 'hooks/Content';
import { getContrastYIQ } from 'func/color';

import Info from './FeatureInfo';

export default function CategoryStyler() {
  const [addEventListener, removeEventListener] = useEvent();
  const { channel, category } = useContent();

  const { color } = useSelector((state) => state[Info.ID].storage);
  const [keyMap, setKeyMap] = useState(null);

  useLayoutEffect(() => {
    if (!category) return;

    const entries = Object.values(category.id2NameMap).map((value) => [
      value,
      Math.random().toString(36).substring(2),
    ]);

    setKeyMap(Object.fromEntries(entries));
  }, [category]);

  useLayoutEffect(() => {
    if (!keyMap) return undefined;

    const container = document.querySelector(`${BOARD}, ${BOARD_IN_ARTICLE}`);
    container.classList.add('ARColor');

    const colorize = () => {
      container.querySelectorAll(BOARD_ITEMS).forEach((a) => {
        const badge = a.querySelector('.badge')?.textContent || '글머리없음';
        if (keyMap[badge]) a.classList.add(`color-${keyMap[badge]}`);
      });
    };

    colorize();
    addEventListener(EVENT_BOARD_REFRESH, colorize);

    return () => {
      removeEventListener(EVENT_BOARD_REFRESH, colorize);
    };
  }, [keyMap, addEventListener, removeEventListener]);

  if (!color[channel.ID]) return null;
  const stylesheet = Object.entries(color[channel.ID]).map(([key, value]) => {
    const { badge, bgcolor, bold, through, disableVisited } = value;

    const colorKey = keyMap?.[category.id2NameMap?.[key]];
    if (!colorKey) return '';

    return `.ARColor .color-${colorKey} {
        ${bgcolor ? `background-color: ${bgcolor} !important;` : ''}
        ${bgcolor ? `color: ${getContrastYIQ(bgcolor)};` : ''}
        ${bold ? 'font-weight: bold;' : ''}
        ${through ? 'text-decoration: line-through;' : ''}
      }
      .ARColor .color-${colorKey}:visited {
        ${
          disableVisited
            ? `color: ${
                bgcolor ? getContrastYIQ(bgcolor) : 'var(--color-text-color)'
              } !important;`
            : ''
        }
      }
      .ARColor .color-${colorKey} .badge {
        ${badge ? `background-color: ${badge} !important;` : ''}
        ${badge ? `border: 1px solid ${badge} !important;` : ''}
        ${badge ? `color: ${getContrastYIQ(badge)} !important` : ''}
      }`;
  });

  return ReactDOM.createPortal(<style>{stylesheet}</style>, document.head);
}
