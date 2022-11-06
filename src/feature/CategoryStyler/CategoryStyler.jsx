import React, { useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';

import { BOARD_ARTICLES_WITHOUT_NOTICE, BOARD_VIEW } from 'core/selector';
import { addAREvent, EVENT_AUTOREFRESH, removeAREvent } from 'core/event';
import { useContent } from 'util/ContentInfo';
import { getContrastYIQ } from 'func/color';

import Info from './FeatureInfo';

export default function CategoryStyler() {
  const {
    load: { board: boardLoaded },
  } = useContent();
  const { channel } = useContent();
  const {
    storage: { color },
  } = useSelector((state) => state[Info.ID]);
  const [board, setBoard] = useState(null);
  const [styleMap, setStyleMap] = useState(null);

  useLayoutEffect(() => {
    if (!boardLoaded) return;
    setBoard(document.querySelector(BOARD_VIEW));
  }, [boardLoaded]);

  useLayoutEffect(() => {
    if (!channel.category) return;
    if (!color[channel.ID]) return;

    setStyleMap(
      Object.keys(color[channel.ID]).reduce(
        (acc, id) => ({
          ...acc,
          [channel.category[id]]: Math.random().toString(36).substring(2),
        }),
        {},
      ),
    );
  }, [channel, color]);

  useLayoutEffect(() => {
    if (!board || !styleMap) return undefined;

    board.classList.add('ARColor');

    const colorize = () => {
      board.querySelectorAll(BOARD_ARTICLES_WITHOUT_NOTICE).forEach((a) => {
        const badge = a.querySelector('.badge')?.textContent || '글머리없음';
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
  const stylesheet = Object.entries(color[channel.ID]).map(([key, value]) => {
    const { badge, bgcolor, bold, through, disableVisited } = value;

    const colorKey = styleMap[channel.category[key]];
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
        ${badge ? `color: ${getContrastYIQ(badge)} !important` : ''}
      }`;
  });

  return ReactDOM.createPortal(<style>{stylesheet}</style>, document.head);
}
