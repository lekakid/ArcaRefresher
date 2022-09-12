import React from 'react';
import { GetApp } from '@material-ui/icons';

import { DrawerItem } from 'menu/ConfigMenu';
import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';

export default React.forwardRef((props, ref) =>
  React.cloneElement(
    <DrawerItem ref={ref} configKey={MODULE_ID} icon={<GetApp />}>
      {MODULE_NAME}
    </DrawerItem>,
    props,
  ),
);
