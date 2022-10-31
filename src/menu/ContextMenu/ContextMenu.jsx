import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import Info from './FeatureInfo';
import ContextSnack from './ContextSnack';
import { setMenuOpen } from './slice';

const useStyles = makeStyles((theme) => ({
  list: {
    '& > *:not(:first-child)': {
      borderTop: `1px solid ${theme.palette.divider}`,
    },
  },
}));

function getKeyCombine(event) {
  let combine = '';

  if (event.ctrlKey) combine += 'c';
  if (event.shiftKey) combine += 's';
  combine += 'r';

  return combine;
}

export default function ContextMenu({ children }) {
  const dispatch = useDispatch();
  const {
    storage: { interactionType },
    open,
  } = useSelector((state) => state[Info.ID]);
  const gestureTrack = useRef({ right: false, count: 0 });
  const triggerList = useRef([]);
  const [mousePos, setMousePos] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const handleDown = ({ button }) => {
      if (button === 2) gestureTrack.current.right = true;
    };
    const handleUp = ({ button }) => {
      if (button === 2) gestureTrack.current.right = false;
    };
    const handleMove = () => {
      if (gestureTrack.current.right) gestureTrack.current.count += 1;
    };
    const handleScroll = () => {
      dispatch(setMenuOpen(false));
    };
    const handleContext = (e) => {
      if (open) {
        e.preventDefault();
        return;
      }

      if (gestureTrack.current.count <= 20) {
        if (getKeyCombine(e) !== interactionType) return;
        setMousePos([e.clientX, e.clientY]);
        triggerList.current.forEach((trigger) => {
          if (trigger(e.target)) {
            e.preventDefault();
            dispatch(setMenuOpen(true));
          }
        });
      }
      gestureTrack.current.count = 0;
    };

    document.addEventListener('mousedown', handleDown);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('contextmenu', handleContext);
    return () => {
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('contextmenu', handleContext);
    };
  }, [dispatch, interactionType, open]);

  const handleClose = useCallback(() => {
    dispatch(setMenuOpen(false));
  }, [dispatch]);

  const [left = 0, top = 0] = mousePos;

  return (
    <>
      <Menu
        keepMounted
        disableScrollLock
        anchorReference="anchorPosition"
        anchorPosition={{ top, left }}
        MenuListProps={{ disablePadding: true }}
        classes={{ list: classes.list }}
        open={open}
        onClose={handleClose}
      >
        <List>
          <MenuItem dense disabled>
            Arca Refresher
          </MenuItem>
        </List>
        {children.map((child, index) =>
          React.cloneElement(child, {
            // eslint-disable-next-line react/no-array-index-key
            key: index,
            triggerList,
          }),
        )}
      </Menu>
      <ContextSnack />
    </>
  );
}
