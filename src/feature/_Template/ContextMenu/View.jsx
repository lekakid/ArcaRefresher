import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { List, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { Person } from '@mui/icons-material';

import { USER_INFO } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';

import Info from '../FeatureInfo';

// 우클릭 메뉴
function ContextMenu({ target, closeMenu }) {
  const data = useContextMenu(
    {
      key: Info.id,
      selector: USER_INFO,
      dataExtractor: () => target.src.split('?')[0],
    },
    [target],
  );

  const handleClick = useCallback(() => {
    // 클릭 시 동작 작성
    closeMenu();
  }, [closeMenu]);

  if (!data) return null;
  return (
    <List>
      <MenuItem onClick={handleClick}>
        <ListItemIcon>
          <Person />
        </ListItemIcon>
        <Typography>MENU_NAME</Typography>
      </MenuItem>
    </List>
  );
}

ContextMenu.propTypes = {
  target: PropTypes.object,
  closeMenu: PropTypes.func,
};

export default ContextMenu;
