import React from 'react';
import { Book } from '@material-ui/icons';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import TemporarySave from './TemporarySave';
import ConfigView from './ConfigView';
import ConfigBuilder from '../$Config/ConfigBuilder';

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
