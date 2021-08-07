import { Menu, MenuItem } from '@material-ui/core';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ContextEvent from './ContextEvent';
import { setContextEvent, setContextOpen } from './slice';

export default function ContextMenu() {
  const dispatch = useDispatch();
  const { menuList, open, mousePos, eventType } = useSelector(
    (state) => state.ContextMenu,
  );

  useEffect(() => {
    const handleContext = (e) => {
      if (open) {
        dispatch(setContextOpen(false));
      }

      ContextEvent.some(({ eventType: type, test, getData }) => {
        if (test(e)) {
          e.preventDefault();
          const event = {
            mousePos: [e.clientX, e.clientY],
            eventType: type,
            data: getData(e),
          };
          dispatch(setContextEvent(event));
          return true;
        }
        return false;
      });
    };

    document.addEventListener('contextmenu', handleContext);

    return () => document.removeEventListener('contextmenu', handleContext);
  }, [dispatch, open]);

  const handleClose = useCallback(() => {
    dispatch(setContextOpen(false));
  }, [dispatch]);

  return (
    <>
      <Menu
        keepMounted
        open={open}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: mousePos[1], left: mousePos[0] }}
      >
        <MenuItem dense>Arca Refresher</MenuItem>
        {menuList.map(({ eventType: type, menu }) =>
          type === eventType ? menu : null,
        )}
      </Menu>
    </>
  );
}
