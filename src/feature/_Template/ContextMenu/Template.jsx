import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { List, ListItemIcon, MenuItem, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

import { USER_INFO } from 'core/selector';
import { useContextMenuTrigger } from 'feature/Menu/ContextMenu/hooks';

import info from '../info';

// 우클릭 메뉴
function ContextMenu({ target, closeMenu }) {
  // 트리거 등록
  useContextMenuTrigger({
    key: info.id,
    selector: USER_INFO,
  });

  const data = useMemo(() => target.src.split('?')[0], [target]);

  const handleClick = useCallback(() => {
    // 클릭 시 동작 작성
    closeMenu();
  }, [closeMenu]);

  if (!data) return null;
  return (
    <List>
      <MenuItem onClick={handleClick}>
        <ListItemIcon>
          <PersonIcon />
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
