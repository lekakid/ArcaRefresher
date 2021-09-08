import React from 'react';
import { Colorize } from '@material-ui/icons';

import ConfigBuilder from 'menu/Config/ConfigBuilder';
import ContextMenuBuilder from 'menu/ContextMenu/ContextMenuBuilder';
import { getUserID } from 'util/parser';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ConfigView from './ConfigView';
import ContextMenu from './ContextMenu';
import ContextInputDialog from './ContextInputDialog';
import Colorizer from './Colorizer';

export default () => (
  <>
    <ConfigBuilder
      configKey={MODULE_ID}
      buttonIcon={<Colorize />}
      buttonText={MODULE_NAME}
      view={<ConfigView />}
    />
    <ContextMenuBuilder
      contextKey={MODULE_ID}
      trigger={(e) => !!e.target.closest('span.user-info')}
      dataGetter={(e) => {
        const userInfo = e.target.closest('span.user-info');
        const id = getUserID(userInfo);

        return { id };
      }}
      view={<ContextMenu />}
    />
    <ContextInputDialog />
    <Colorizer />
  </>
);
