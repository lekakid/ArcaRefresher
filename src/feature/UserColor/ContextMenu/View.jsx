import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Colorize } from '@material-ui/icons';

import { USER_INFO } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';
import { getUserID } from 'func/user';

import { $setColor } from '../slice';
import Info from '../FeatureInfo';
import InputDialog from './InputDialog';

function ContextMenu({ targetRef }) {
  const dispatch = useDispatch();
  const [open, closeMenu] = useContextMenu({
    method: 'closest',
    selector: USER_INFO,
  });
  const {
    storage: { color },
  } = useSelector((state) => state[Info.ID]);
  const [data, setData] = useState(undefined);
  const [target, setTarget] = useState(undefined);

  useEffect(() => {
    if (!open) {
      setData(undefined);
      return;
    }

    const userInfo = targetRef.current.closest(USER_INFO);
    if (!userInfo) return;

    setData(getUserID(userInfo));
  }, [open, targetRef]);

  const handleClick = useCallback(() => {
    setTarget(data);
    closeMenu();
  }, [closeMenu, data]);

  const handleInputClose = useCallback(() => {
    setTarget(undefined);
  }, []);

  const handleInputSubmit = useCallback(
    (value) => {
      dispatch($setColor({ user: target, color: value }));
    },
    [target, dispatch],
  );

  return (
    <>
      {data && (
        <List>
          <MenuItem onClick={handleClick}>
            <ListItemIcon>
              <Colorize />
            </ListItemIcon>
            <Typography>색상 설정</Typography>
          </MenuItem>
        </List>
      )}
      <InputDialog
        open={!!target}
        defaultValue={color[target] || ''}
        onClose={handleInputClose}
        onSubmit={handleInputSubmit}
      />
    </>
  );
}

export default ContextMenu;
