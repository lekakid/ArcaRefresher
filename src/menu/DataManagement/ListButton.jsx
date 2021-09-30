import React from 'react';
import { Settings } from '@material-ui/icons';

import { ConfigListButton } from 'menu/ConfigMenu';
import { ID, NAME } from './meta';

const ListButton = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function ListButton(_props, ref) {
    return (
      <ConfigListButton ref={ref} configKey={ID} icon={<Settings />}>
        {NAME}
      </ConfigListButton>
    );
  },
);

export default ListButton;
