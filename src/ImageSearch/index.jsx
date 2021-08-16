import React from 'react';
import { ARTICLE_IMAGES } from '../$Common/Selector';

import ContextMenuBuilder from '../$ContextMenu/ContextMenuBuilder';

import ContextMenu from './ContextMenu';
import { MODULE_ID } from './ModuleInfo';

export default () => (
  <ContextMenuBuilder
    contextKey={MODULE_ID}
    trigger={(e) => !!e.target.closest(ARTICLE_IMAGES)}
    dataGetter={(e) => {
      const url = e.target.src.split('?')[0];
      const orig = `${url}${
        e.target.tagName === 'VIDEO' ? '.gif' : ''
      }?type=orig`;

      return { orig };
    }}
    view={<ContextMenu />}
  />
);
