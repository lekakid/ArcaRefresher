import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItemIcon, MenuItem, Typography } from '@mui/material';
import FastRewindIcon from '@mui/icons-material/FastRewind';

import { useContextMenuTrigger } from 'feature/Menu/ContextMenu/hooks';

import { toggleTemporaryDisabled } from '../slice';
import info from '../info';

// 우클릭 메뉴
function Base64({ target, closeMenu }) {
  const dispatch = useDispatch();

  useContextMenuTrigger({
    key: info.id,
    selector: '.base64',
  });

  const handleClick = useCallback(() => {
    dispatch(toggleTemporaryDisabled());

    closeMenu();
  }, [dispatch, closeMenu]);

  if (!target) return null;
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

Base64.propTypes = {
  target: PropTypes.object,
  closeMenu: PropTypes.func,
};

export default Base64;
