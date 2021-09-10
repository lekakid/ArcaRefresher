import React from 'react';
import { Brush } from '@material-ui/icons';

import { ConfigListButton } from 'menu/ConfigMenu';
import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';

const ListButton = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function ListButton(_props, ref) {
    return (
      <ConfigListButton ref={ref} configKey={MODULE_ID} icon={<Brush />}>
        {MODULE_NAME}
      </ConfigListButton>
    );
  },
);

export default ListButton;
