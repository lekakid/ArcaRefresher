import React from 'react';
import { Menu } from '@material-ui/icons';

import ConfigBuilder from 'menu/Config/ConfigBuilder';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ConfigView from './ConfigView';
import ContextMenu from './ContextMenu';
import ContextSnack from './ContextSnack';

export { default as useContextMenuData } from './useContextMenuData';
export { default as ContextMenuList } from './ContextMenuList';
export { default as ContextMenuBuilder } from './ContextMenuBuilder';

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
