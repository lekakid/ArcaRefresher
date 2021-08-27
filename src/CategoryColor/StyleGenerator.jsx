import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';

import useElementQuery from '../$Common/useElementQuery';
import {
  BOARD_ARTICLES_WITHOUT_NOTICE,
  BOARD_LOADED,
  BOARD_VIEW,
} from '../$Common/Selector';
import { addAREvent, EVENT_AUTOREFRESH, removeAREvent } from '../$Common/Event';
import { getCategory } from '../$Common/Parser';

import { MODULE_ID } from './ModuleInfo';
import getContrastYIQ from './getContrastYIQ';

export default function StyleGenerator() {
  const boardLoaded = useElementQuery(BOARD_LOADED);
  const { channelID, color } = useSelector((state) => state[MODULE_ID]);
  const [board, setBoard] = useState(null);
  const [categoryMap, setCategoryMap] = useState({});
  const [styleMap, setStyleMap] = useState({});

  useEffect(() => {
    if (!boardLoaded) return;
    setBoard(document.querySelector(BOARD_VIEW));
    setCategoryMap(getCategory());
  }, [boardLoaded]);

  useEffect(() => {
    if (color[channelID]) {
      setStyleMap(
        Object.keys(color[channelID])?.reduce(
          (acc, id) => ({
            ...acc,
            [categoryMap[id]]: Math.random().toString(36).substr(2),
          }),
          {},
        ),
      );
    }
  }, [categoryMap, channelID, color]);

  useEffect(() => {
    if (!board) return null;

    board.classList.add('ARColor');

    const colorize = () => {
      [...board.querySelectorAll(BOARD_ARTICLES_WITHOUT_NOTICE)].forEach(
        (a) => {
          const badge = a.querySelector('.badge')?.textContent || '일반';
          if (styleMap[badge]) a.classList.add(`color-${styleMap[badge]}`);
        },
      );
    };

    colorize();
    addAREvent(EVENT_AUTOREFRESH, colorize);

    return () => {
      removeAREvent(EVENT_AUTOREFRESH, colorize);
    };
  }, [board, styleMap]);

  if (!boardLoaded) return null;
  if (!color[channelID]) return null;

  const stylesheet = Object.keys(color[channelID]).map((key) => {
    const { badge, bgcolor, bold, through, disableVisited } =
      color[channelID][key];

    const colorKey = styleMap[categoryMap[key]];
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
