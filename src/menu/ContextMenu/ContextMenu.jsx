import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import Info from './FeatureInfo';
import { setOpen } from './slice';

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

export default function ContextMenu({ menuList }) {
  const dispatch = useDispatch();
  const { interactionType } = useSelector((state) => state[Info.ID].storage);
  const { open, triggerList } = useSelector((state) => state[Info.ID]);
  const gestureTrack = useRef({ right: false, count: 0 });
  const targetRef = useRef(undefined);
  const [mousePos, setMousePos] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const handleDown = ({ button }) => {
      if (button === 2) {
        gestureTrack.current.right = true;
        dispatch(setOpen(false));
      }
    };
    const handleUp = ({ button }) => {
      if (button === 2) gestureTrack.current.right = false;
    };
    const handleMove = () => {
      if (gestureTrack.current.right) gestureTrack.current.count += 1;
    };
    const handleScroll = () => {
      dispatch(setOpen(false));
    };
    const handleContext = (e) => {
      const { count: trackCount } = gestureTrack.current;
      gestureTrack.current.count = 0;

      if (trackCount > 20) return;
      if (getKeyCombine(e) !== interactionType) return;
      if (!triggerList.some((selector) => !!e.target.closest(selector))) return;

      e.preventDefault();

      setMousePos([e.clientX, e.clientY]);
      targetRef.current = e.target;
      dispatch(setOpen(true));
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
  }, [dispatch, interactionType, triggerList]);

  const handleClose = useCallback(() => {
    dispatch(setOpen(false));
  }, [dispatch]);

  const [left = 0, top = 0] = mousePos;

  return (
    <Menu
      keepMounted
      disableScrollLock
      disableRestoreFocus
      anchorReference="anchorPosition"
      anchorPosition={{ top, left }}
      MenuListProps={{ disablePadding: true }}
      TransitionProps={{ exit: false }}
      classes={{ list: classes.list }}
      open={open}
      onClose={handleClose}
    >
      <List>
        <MenuItem dense disabled>
          Arca Refresher
        </MenuItem>
      </List>
      {menuList.map(({ key, View }) => (
        <View key={key} targetRef={targetRef} />
      ))}
    </Menu>
  );
}
