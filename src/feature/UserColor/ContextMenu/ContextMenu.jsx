import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Colorize } from '@material-ui/icons';

import { USER_INFO } from 'core/selector';
import { setClose } from 'menu/ContextMenu/slice';
import { getUserID } from 'func/user';

import { $setColor } from '../slice';
import Info from '../FeatureInfo';
import InputDialog from './InputDialog';

function ContextMenu({ triggerList }) {
  const dispatch = useDispatch();
  const {
    storage: { color },
  } = useSelector((state) => state[Info.ID]);
  const [open, setOpen] = useState(false);
  const data = useRef(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const trigger = (target) => {
      if (!target.closest(USER_INFO)) {
        data.current = null;
        setValid(false);
        return false;
      }

      const userInfo = target.closest(USER_INFO);
      data.current = getUserID(userInfo);
      setValid(true);
      return true;
    };

    triggerList.current.push(trigger);
  }, [triggerList]);

  const handleClick = useCallback(() => {
    dispatch(setClose());
    setOpen(true);
  }, [dispatch]);

  const handleInputClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleInputSubmit = useCallback(
    (value) => {
      dispatch($setColor({ user: data.current, color: value }));
    },
    [dispatch],
  );

  if (!valid) return null;
  return (
    <List>
      <MenuItem onClick={handleClick}>
        <ListItemIcon>
          <Colorize />
        </ListItemIcon>
        <Typography>색상 설정</Typography>
      </MenuItem>
      <InputDialog
        open={open}
        defaultValue={color[data.current]}
        onClose={handleInputClose}
        onSubmit={handleInputSubmit}
      />
    </List>
  );
}

export default ContextMenu;
