import React from 'react';
import { Keyboard } from '@material-ui/icons';

import ConfigBuilder from '../$Config/ConfigBuilder';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ConfigView from './ConfigView';
import Loader from './Loader';

export default () => (
  <>
    <ConfigBuilder
      configKey={MODULE_ID}
      buttonIcon={<Keyboard />}
      buttonText={MODULE_NAME}
      view={<ConfigView />}
    />
    <Loader />
  </>
);
