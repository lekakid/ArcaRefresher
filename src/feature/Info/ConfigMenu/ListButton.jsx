import React from 'react';
import { Info } from '@material-ui/icons';

import { DrawerItem } from 'menu/ConfigMenu';
import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';

export default React.forwardRef((props, ref) =>
  React.cloneElement(
    <DrawerItem ref={ref} configKey={MODULE_ID} icon={<Info />}>
      {MODULE_NAME}
    </DrawerItem>,
    props,
  ),
);
