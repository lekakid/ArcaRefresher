import React from 'react';
import { Colorize } from '@material-ui/icons';

import ConfigBuilder from '../$Config/ConfigBuilder';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import StyleGenerator from './StyleGenerator';
import ConfigView from './ConfigView';

export default () => (
  <>
    <ConfigBuilder
      configKey={MODULE_ID}
      buttonIcon={<Colorize />}
      buttonText={MODULE_NAME}
      view={<ConfigView />}
    />
    <StyleGenerator />
  </>
);
