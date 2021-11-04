import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Colorize } from '@material-ui/icons';

import { USER_INFO } from 'core/selector';
import { ContextMenuList, useContextMenu } from 'menu/ContextMenu';
import { setClose } from 'menu/ContextMenu/slice';
import { getUserID } from 'util/user';

import { setColor } from '../slice';
import { MODULE_ID } from '../ModuleInfo';
import InputDialog from './InputDialog';

const ContextMenu = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function ContextMenu(_props, ref) {
    const dispatch = useDispatch();
    const { color } = useSelector((state) => state[MODULE_ID]);
    const [open, setOpen] = useState(false);

    const trigger = useCallback(
      ({ target }) => !!target.closest(USER_INFO),
      [],
    );
    const dataGetter = useCallback(({ target }) => {
      const userInfo = target.closest(USER_INFO);
      const id = getUserID(userInfo);

      return { id };
    }, []);
    const data = useContextMenu({ trigger, dataGetter });

    const handleClick = useCallback(() => {
      dispatch(setClose());
      setOpen(true);
    }, [dispatch]);

    const handleInputClose = useCallback(() => {
      setOpen(false);
    }, []);

    const handleInputSubmit = useCallback(
      (value) => {
        const { id } = data;
        dispatch(setColor({ user: id, color: value }));
      },
      [data, dispatch],
    );

    if (!data) return null;
    return (
      <ContextMenuList>
        <MenuItem ref={ref} onClick={handleClick}>
          <ListItemIcon>
            <Colorize />
          </ListItemIcon>
          <Typography>색상 설정</Typography>
        </MenuItem>
        <InputDialog
          open={open}
          defaultValue={color[data.id]}
          onClose={handleInputClose}
          onSubmit={handleInputSubmit}
        />
      </ContextMenuList>
    );
  },
);

export default ContextMenu;
