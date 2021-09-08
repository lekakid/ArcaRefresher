import React from 'react';
import { Delete } from '@material-ui/icons';

import ConfigBuilder from 'menu/Config/ConfigBuilder';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ConfigView from './ConfigView';
import Remover from './Remover';

export default () => (
  <>
    <ConfigBuilder
      configKey={MODULE_ID}
      buttonIcon={<Delete />}
      buttonText={MODULE_NAME}
      view={<ConfigView />}
    />
    <Remover />
  </>
);
