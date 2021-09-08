import React from 'react';
import { Refresh } from '@material-ui/icons';

import ConfigBuilder from 'menu/Config/ConfigBuilder';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ConfigView from './ConfigView';
import AutoRefresher from './AutoRefresher';

export default () => (
  <>
    <ConfigBuilder
      configKey={MODULE_ID}
      buttonIcon={<Refresh />}
      buttonText={MODULE_NAME}
      view={<ConfigView />}
    />
    <AutoRefresher />
  </>
);
