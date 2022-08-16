import React, { useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';

import { useElementQuery } from 'core/hooks';
import {
  BOARD_ARTICLES_WITHOUT_NOTICE,
  BOARD_LOADED,
  BOARD_VIEW,
} from 'core/selector';
import { addAREvent, EVENT_AUTOREFRESH, removeAREvent } from 'core/event';
import { useParser } from 'util/Parser';
import getContrastYIQ from 'util/color';

import { MODULE_ID } from './ModuleInfo';

export default function CategoryStyler() {
  const boardLoaded = useElementQuery(BOARD_LOADED);
  const { channelID, category } = useParser();
  const { color } = useSelector((state) => state[MODULE_ID]);
  const [board, setBoard] = useState(null);
  const [styleMap, setStyleMap] = useState(null);

  useLayoutEffect(() => {
    if (!boardLoaded) return;
    setBoard(document.querySelector(BOARD_VIEW));
  }, [boardLoaded]);

  useLayoutEffect(() => {
    if (!category) return;
    if (!color[channelID]) return;

    setStyleMap(
      Object.keys(color[channelID]).reduce(
        (acc, id) => ({
          ...acc,
          [category[id]]: Math.random().toString(36).substr(2),
        }),
        {},
      ),
    );
  }, [category, channelID, color]);

  useLayoutEffect(() => {
    if (!board || !styleMap) return () => {};

    board.classList.add('ARColor');

    const colorize = () => {
      board.querySelectorAll(BOARD_ARTICLES_WITHOUT_NOTICE).forEach((a) => {
        const badge = a.querySelector('.badge').textContent || '글머리없음';
        if (styleMap[badge]) a.classList.add(`color-${styleMap[badge]}`);
      });
    };

    colorize();
    addAREvent(EVENT_AUTOREFRESH, colorize);

    return () => {
      removeAREvent(EVENT_AUTOREFRESH, colorize);
    };
  }, [board, styleMap]);

  if (!styleMap) return null;
  const stylesheet = Object.entries(color[channelID]).map(([key, value]) => {
    const { badge, bgcolor, bold, through, disableVisited } = value;

    const colorKey = styleMap[category[key]];
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
        ${badge ? `color: ${getContrastYIQ(badge)}` : ''}
      }`;
  });

  return ReactDOM.createPortal(<style>{stylesheet}</style>, document.head);
}
