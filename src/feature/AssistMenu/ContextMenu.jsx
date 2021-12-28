import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Person } from '@material-ui/icons';

import { USER_INFO } from 'core/selector';
import { setClose } from 'menu/ContextMenu/slice';

const ContextMenu = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function ContextMenu({ triggerList }, ref) {
    const dispatch = useDispatch();
    const data = useRef(null);
    const [valid, setValid] = useState(false);

    useEffect(() => {
      const trigger = (target) => {
        const userInfo = target.closest(USER_INFO);
        if (!userInfo) {
          data.current = null;
          setValid(false);
          return false;
        }

        const id =
          userInfo?.querySelector('[data-filter]')?.dataset.filter || '';
        data.current = id.replace('#', '/');
        setValid(/^[^,]+$/.test(id));
        return true;
      };

      triggerList.current.push(trigger);
    }, [triggerList]);

    const handleInfo = useCallback(() => {
      window.open(`https://arca.live/u/@${data.current}`);
      dispatch(setClose());
    }, [dispatch]);

    if (!valid) return null;
    return (
      <List>
        <MenuItem ref={ref} onClick={handleInfo}>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <Typography>사용자 정보</Typography>
        </MenuItem>
      </List>
    );
  },
);

export default ContextMenu;
