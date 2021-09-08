import React from 'react';
import { Book } from '@material-ui/icons';

import ConfigBuilder from 'menu/Config/ConfigBuilder';
import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import TemporarySave from './TemporarySave';
import ConfigView from './ConfigView';

export default () => (
  <>
    <ConfigBuilder
      configKey={MODULE_ID}
      buttonIcon={<Book />}
      buttonText={MODULE_NAME}
      view={<ConfigView />}
    />
    <TemporarySave />
  </>
);
