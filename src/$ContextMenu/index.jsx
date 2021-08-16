import React from 'react';
import { Menu } from '@material-ui/icons';

import ConfigBuilder from '../$Config/ConfigBuilder';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ConfigView from './ConfigView';
import ContextMenu from './ContextMenu';
import ContextSnack from './ContextSnack';

export default () => (
  <>
    <ConfigBuilder
      configKey={MODULE_ID}
      buttonIcon={<Menu />}
      buttonText={MODULE_NAME}
      view={<ConfigView />}
    />
    <ContextMenu />
    <ContextSnack />
  </>
);
