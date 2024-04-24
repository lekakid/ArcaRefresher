import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { FastRewind } from '@mui/icons-material';

import { useContextMenu } from 'menu/ContextMenu';

import Info from '../FeatureInfo';
import { toggleTemporaryDisabled } from '../slice';

// 우클릭 메뉴
function ContextMenu({ target, closeMenu }) {
  const dispatch = useDispatch();

  const data = useContextMenu(
    {
      key: Info.id,
      selector: 'a.base64',
      dataExtractor: () => target,
    },
    [target],
  );

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

ContextMenu.propTypes = {
  target: PropTypes.object,
  closeMenu: PropTypes.func,
};

export default ContextMenu;
