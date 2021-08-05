import { Menu, MenuItem, Snackbar } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ContextEvent from './ContextEvent';

const initState = {
  mouseX: null,
  mouseY: null,
  eventType: null,
  data: null,
  open: false,
};

export default function ContextMenu() {
  const { menuList } = useSelector((state) => state.ContextMenu);
  const [contextState, setContextState] = useState(initState);
  const [snack, setSnack] = useState('');

  useEffect(() => {
    const handleContext = (e) => {
      setContextState((prevState) => {
        if (prevState.open) {
          return {
            ...prevState,
            open: false,
          };
        }

        for (let i = 0; i < ContextEvent.length; i += 1) {
          const { eventType, test, getData } = ContextEvent[i];

          if (test(e)) {
            e.preventDefault();
            return {
              mouseX: e.clientX,
              mouseY: e.clientY,
              eventType,
              data: getData(e),
              open: true,
            };
          }
        }
        return initState;
      });
    };

    document.addEventListener('contextmenu', handleContext);
  }, []);

  const handleClose = useCallback(() => {
    setContextState((prevState) => ({
      ...prevState,
      open: false,
    }));
  }, []);

  const handleSnackClose = useCallback(() => {
    setSnack('');
  }, []);

  return (
    <>
      <Snackbar
        open={snack}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        message={snack}
      />
      <Menu
        keepMounted
        open={contextState.open}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: contextState.mouseY, left: contextState.mouseX }}
      >
        <MenuItem dense>Arca Refresher</MenuItem>
        {menuList.map(({ eventType: type, Component }) => {
          if (type === contextState.eventType)
            return (
              <Component
                data={contextState.data}
                onClose={handleClose}
                setSnack={setSnack}
              />
            );
          return null;
        })}
      </Menu>
    </>
  );
}
