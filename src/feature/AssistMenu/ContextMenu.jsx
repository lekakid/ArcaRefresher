import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Person } from '@material-ui/icons';

import { USER_INFO } from 'core/selector';
import { ContextMenuList, useContextMenu } from 'menu/ContextMenu';
import { setClose } from 'menu/ContextMenu/slice';

const ContextMenu = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function ContextMenu(_props, ref) {
    const dispatch = useDispatch();

    const trigger = useCallback(({ target }) => {
      const id = target.closest(USER_INFO)?.querySelector('[data-filter]')
        ?.dataset.filter;
      if (!id) return false;

      return /^[^,]*$/.test(id);
    }, []);
    const dataGetter = useCallback(({ target }) => {
      const id = target
        .closest(USER_INFO)
        .querySelector('[data-filter]')
        .dataset.filter.replace('#', '/');

      return { id };
    }, []);
    const data = useContextMenu({ trigger, dataGetter });

    const handleGoogle = useCallback(() => {
      window.open(`https://arca.live/u/@${data.id}`);
      dispatch(setClose());
    }, [data, dispatch]);

    if (!data) return null;
    return (
      <ContextMenuList>
        <MenuItem ref={ref} onClick={handleGoogle}>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <Typography>사용자 정보</Typography>
        </MenuItem>
      </ContextMenuList>
    );
  },
);

export default ContextMenu;
