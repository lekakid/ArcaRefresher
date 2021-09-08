import { Menu, MenuItem } from '@material-ui/core';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MODULE_ID } from './ModuleInfo';
import { openContextMenu, closeContextMenu } from './slice';

export default function ContextMenu() {
  const dispatch = useDispatch();
  const { enabled, menuList, open, mousePos, data } = useSelector(
    (state) => state[MODULE_ID],
  );

  useEffect(() => {
    if (!enabled) return null;

    const handleContext = (e) => {
      if (open) {
        dispatch(closeContextMenu(false));
      }

      const init = {};
      const eventData = menuList.reduce(
        (acc, { contextKey, trigger, dataGetter }) => {
          if (trigger(e)) {
            e.preventDefault();
            return { ...acc, [contextKey]: dataGetter(e) };
          }

          return acc;
        },
        init,
      );
      if (eventData !== init)
        dispatch(
          openContextMenu({
            mousePos: [e.clientX, e.clientY],
            data: eventData,
          }),
        );
    };

    document.addEventListener('contextmenu', handleContext);
    return () => document.removeEventListener('contextmenu', handleContext);
  }, [dispatch, enabled, menuList, open]);

  const handleClose = useCallback(() => {
    dispatch(closeContextMenu(false));
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
        {menuList.map(({ contextKey, view }) =>
          data[contextKey] ? view : null,
        )}
      </Menu>
    </>
  );
}
