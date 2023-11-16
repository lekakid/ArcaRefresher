import React, { useCallback } from 'react';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { FastRewind } from '@material-ui/icons';

import { useContextMenu } from 'menu/ContextMenu';

import { useDispatch } from 'react-redux';
import Info from '../FeatureInfo';
import { toggleTemporaryDisabled } from '../slice';

// 우클릭 메뉴
function ContextMenu({ target }) {
  const dispatch = useDispatch();

  const [data, closeMenu] = useContextMenu({
    key: Info.ID,
    selector: 'a.base64',
    dataExtractor: () => target,
  });

  const handleClick = useCallback(() => {
    dispatch(toggleTemporaryDisabled());

    closeMenu();
  }, [dispatch, closeMenu]);

  if (!data) return null;
  return (
    <List>
      <MenuItem onClick={handleClick}>
        <ListItemIcon>
          <FastRewind />
        </ListItemIcon>
        <Typography>복호화 임시해제</Typography>
      </MenuItem>
    </List>
  );
}

export default ContextMenu;
