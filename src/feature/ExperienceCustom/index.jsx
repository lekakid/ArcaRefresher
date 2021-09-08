import React from 'react';
import { DirectionsRun } from '@material-ui/icons';

import ConfigBuilder from 'menu/Config/ConfigBuilder';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import ConfigView from './ConfigView';
import ExperienceCustomizer from './ExperienceCumtomizer';

export default () => (
  <>
    <ConfigBuilder
      configKey={MODULE_ID}
      buttonIcon={<DirectionsRun />}
      buttonText={MODULE_NAME}
      view={<ConfigView />}
    />
    <ExperienceCustomizer />
  </>
);
