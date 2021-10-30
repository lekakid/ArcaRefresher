import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, MenuItem } from '@material-ui/core';

import { MODULE_ID } from './ModuleInfo';
import ContextSnack from './ContextSnack';
import { setClose } from './slice';

export default function ContextMenu({ children }) {
  const dispatch = useDispatch();
  const {
    config: { enabled },
    open,
  } = useSelector((state) => state[MODULE_ID]);
  const [mousePos, setMousePos] = useState([]);

  useEffect(() => {
    if (!enabled) return null;

    const handleContext = ({ clientX, clientY }) => {
      dispatch(setClose());
      setMousePos([clientX, clientY]);
    };

    const handleScroll = () => {
      dispatch(setClose());
    };

    document.addEventListener('scroll', handleScroll);
    document.addEventListener('contextmenu', handleContext);
    return () => {
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('contextmenu', handleContext);
    };
  }, [dispatch, enabled]);

  const handleClose = useCallback(() => {
    dispatch(setClose());
  }, [dispatch]);

  const [left = 0, top = 0] = mousePos || [];

  return (
    <>
      <Menu
        keepMounted
        open={open}
        onClose={handleClose}
        disableScrollLock
        anchorReference="anchorPosition"
        anchorPosition={{ top, left }}
      >
        <MenuItem dense disabled>
          Arca Refresher
        </MenuItem>
        {children}
      </Menu>
      <ContextSnack />
    </>
  );
}
