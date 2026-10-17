import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItemIcon, MenuItem, Typography } from '@mui/material';
import FastRewindIcon from '@mui/icons-material/FastRewind';

import { useContextMenu } from 'menu/ContextMenu';

import { toggleTemporaryDisabled } from '../slice';
import info from '../info';

// 우클릭 메뉴
function ContextMenu({ target, closeMenu }) {
  const dispatch = useDispatch();

  const data = useContextMenu(
    {
      key: info.id,
      selector: '.base64',
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
          <FastRewindIcon />
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
