import React from 'react';
import { Image } from '@material-ui/icons';

import ConfigBuilder from '../$Config/ConfigBuilder';
import ContextMenuBuilder from '../$ContextMenu/ContextMenuBuilder';
import { ARTICLE_IMAGES } from '../$Common/Selector';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ConfigView from './ConfigView';
import ContextMenu from './ContextMenu';
import MyImageLoader from './MyImageLoader';

export default () => (
  <>
    <ConfigBuilder
      configKey={MODULE_ID}
      buttonIcon={<Image />}
      buttonText={MODULE_NAME}
      view={<ConfigView />}
    />
    <ContextMenuBuilder
      contextKey={MODULE_ID}
      trigger={(e) => !!e.target.closest(ARTICLE_IMAGES)}
      dataGetter={(e) => {
        const url = e.target.src.split('?')[0];
        return { url };
      }}
      view={<ContextMenu />}
    />
    <MyImageLoader />
  </>
);
