import React, { useCallback, useState } from 'react';
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
  const {
    storage: { color },
  } = useSelector((state) => state[Info.ID]);
  const [user, setUser] = useState(undefined);

  const [data, closeMenu] = useContextMenu({
    targetRef,
    selector: USER_INFO,
    dataExtractor: (target) => getUserID(target),
  });

  const handleClick = useCallback(() => {
    setUser(data);
    closeMenu();
  }, [closeMenu, data]);

  const handleInputClose = useCallback(() => {
    setUser(undefined);
  }, []);

  const handleInputSubmit = useCallback(
    (value) => {
      dispatch($setColor({ user, color: value }));
    },
    [user, dispatch],
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
        open={!!user}
        defaultValue={color[user] || ''}
        onClose={handleInputClose}
        onSubmit={handleInputSubmit}
      />
    </>
  );
}

ContextMenu.sortOrder = 101;

export default ContextMenu;
