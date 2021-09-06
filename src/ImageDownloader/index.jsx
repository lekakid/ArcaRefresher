import React from 'react';
import { GetApp } from '@material-ui/icons';

import ConfigBuilder from '../$Config/ConfigBuilder';
import ContextMenuBuilder from '../$ContextMenu/ContextMenuBuilder';
import { ARTICLE_IMAGES } from '../$Common/Selector';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ContextMenu from './ContextMenu';
import DialogButton from './DialogButton';
import ConfigView from './ConfigView';

export default () => (
  <>
    <ConfigBuilder
      configKey={MODULE_ID}
      buttonIcon={<GetApp />}
      buttonText={MODULE_NAME}
      view={<ConfigView />}
    />
    <ContextMenuBuilder
      contextKey={MODULE_ID}
      trigger={(e) => !!e.target.closest(ARTICLE_IMAGES)}
      dataGetter={(e) => {
        const url = e.target.src.split('?')[0];

        const orig = `${url}${
          e.target.tagName === 'VIDEO' ? '.gif' : ''
        }?type=orig`;
        const thumb = `${url}${e.target.tagName === 'VIDEO' ? '.gif' : ''}`;
        const [, ext] =
          e.target.tagName === 'VIDEO' ? [0, 'gif'] : url.match(/\.(.{3,4})$/);
        const [uploadName] = url.match(/[0-9a-f]{64}/g);

        return { orig, thumb, ext, uploadName };
      }}
      view={<ContextMenu />}
    />
    <DialogButton />
  </>
);
