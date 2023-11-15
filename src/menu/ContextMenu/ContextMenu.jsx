import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Menu, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import Info from './FeatureInfo';
import { setOpen } from './slice';

const styles = (theme) => ({
  list: {
    '& > *:not(:first-child)': {
      borderTop: `1px solid ${theme.palette.divider}`,
    },
  },
});

function getKeyCombine(event) {
  let combine = '';

  if (event.ctrlKey) combine += 'c';
  if (event.shiftKey) combine += 's';
  combine += 'r';

  return combine;
}

function ContextMenu({ classes, menuList }) {
  const dispatch = useDispatch();
  const { interactionType } = useSelector((state) => state[Info.ID].storage);
  const { mousePos, triggerList } = useSelector((state) => state[Info.ID]);
  const gestureTrack = useRef({ right: false, count: 0 });
  const [targetTable, setTargetTable] = useState(undefined);

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
      dispatch(setOpen(null));
    };
    const handleContext = (e) => {
      const { count: trackCount } = gestureTrack.current;
      gestureTrack.current.count = 0;

      if (trackCount > 20) return;
      if (getKeyCombine(e) !== interactionType) return;
      let triggered = false;
      const entries = triggerList.map(({ key, selector }) => {
        const target = e.target.closest(selector);

        if (target) triggered = true;
        return [key, target];
      });

      if (!triggered) return;

      e.preventDefault();
      setTargetTable(Object.fromEntries(entries));
      dispatch(setOpen([e.clientX, e.clientY]));
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
    dispatch(setOpen(null));
  }, [dispatch]);

  const [left, top] = mousePos || [0, 0];

  return (
    <Menu
      keepMounted
      disableScrollLock
      disableRestoreFocus
      anchorReference="anchorPosition"
      anchorPosition={{ top, left }}
      MenuListProps={{ disablePadding: true }}
      TransitionProps={{ timeout: { enter: 150, exit: 0 } }}
      classes={{ list: classes.list }}
      open={!!mousePos}
      onClose={handleClose}
    >
      <List>
        <MenuItem dense disabled>
          Arca Refresher
        </MenuItem>
      </List>
      {menuList.map(({ key, View }) => (
        <View key={key} target={targetTable?.[key]} />
      ))}
    </Menu>
  );
}

export default withStyles(styles)(ContextMenu);
