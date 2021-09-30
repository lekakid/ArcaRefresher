import React from 'react';
import { Comment } from '@material-ui/icons';

import { ConfigListButton } from 'menu/ConfigMenu';
import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';

const ListButton = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function ListButton(props, ref) {
    return React.cloneElement(
      <ConfigListButton ref={ref} configKey={MODULE_ID} icon={<Comment />}>
        {MODULE_NAME}
      </ConfigListButton>,
      props,
    );
  },
);

export default ListButton;
