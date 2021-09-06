import React from 'react';
import { Brush } from '@material-ui/icons';

import ConfigBuilder from '../$Config/ConfigBuilder';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ConfigView from './ConfigView';
import ThemeCustomizer from './ThemeCustomizer';

export default () => (
  <>
    <ConfigBuilder
      configKey={MODULE_ID}
      buttonIcon={<Brush />}
      buttonText={MODULE_NAME}
      view={<ConfigView />}
    />
    <ThemeCustomizer />
  </>
);
