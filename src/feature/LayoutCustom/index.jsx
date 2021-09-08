import React from 'react';
import { Layers } from '@material-ui/icons';

import ConfigBuilder from 'menu/Config/ConfigBuilder';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ConfigView from './ConfigView';
import LayoutCustomizer from './LayoutCustomizer';

export default () => (
  <>
    <ConfigBuilder
      configKey={MODULE_ID}
      buttonIcon={<Layers />}
      buttonText={MODULE_NAME}
      view={<ConfigView />}
    />
    <LayoutCustomizer />
  </>
);
