import React from 'react';
import { Block } from '@material-ui/icons';

import ConfigBuilder from 'menu/Config/ConfigBuilder';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ConfigView from './ConfigView';
import ContextMenu from './ContextMenu';
import { ArticleMuter, CommentMuter, EmoticonMuter } from './feature';

export default () => (
  <>
    <ConfigBuilder
      configKey={MODULE_ID}
      buttonIcon={<Block />}
      buttonText={MODULE_NAME}
      view={<ConfigView />}
    />
    <ContextMenu />
    <ArticleMuter />
    <CommentMuter />
    <EmoticonMuter />
  </>
);
