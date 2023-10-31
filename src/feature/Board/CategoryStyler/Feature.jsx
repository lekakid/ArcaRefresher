import React, { useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';

import {
  BOARD_ITEMS,
  BOARD_LOADED,
  BOARD,
  BOARD_IN_ARTICLE,
} from 'core/selector';
import { addAREvent, EVENT_AUTOREFRESH, removeAREvent } from 'core/event';
import { useLoadChecker } from 'hooks';
import { useContent } from 'util/ContentInfo';
import { getContrastYIQ } from 'func/color';

import Info from './FeatureInfo';

export default function CategoryStyler() {
  const boardLoaded = useLoadChecker(BOARD_LOADED);
  const { channel } = useContent();
  const { color } = useSelector((state) => state[Info.ID].storage);
  const [board, setBoard] = useState(null);
  const [keyMap, setKeyMap] = useState(null);

  useLayoutEffect(() => {
    if (!boardLoaded) return;
    setBoard(document.querySelector(`${BOARD}, ${BOARD_IN_ARTICLE}`));
  }, [boardLoaded]);

  useLayoutEffect(() => {
    if (!channel.category) return;

    const entries = Object.values(channel.category).map((value) => [
      value,
      Math.random().toString(36).substring(2),
    ]);

    setKeyMap(Object.fromEntries(entries));
  }, [channel]);

  useLayoutEffect(() => {
    if (!board || !keyMap) return undefined;

    board.classList.add('ARColor');

    const colorize = () => {
      board.querySelectorAll(BOARD_ITEMS).forEach((a) => {
        const badge = a.querySelector('.badge')?.textContent || '글머리없음';
        if (keyMap[badge]) a.classList.add(`color-${keyMap[badge]}`);
      });
    };

    colorize();
    addAREvent(EVENT_AUTOREFRESH, colorize);

    return () => {
      removeAREvent(EVENT_AUTOREFRESH, colorize);
    };
  }, [board, keyMap]);

  if (!color[channel.ID]) return null;
  const stylesheet = Object.entries(color[channel.ID]).map(([key, value]) => {
    const { badge, bgcolor, bold, through, disableVisited } = value;

    const colorKey = keyMap?.[channel.category?.[key]];
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
