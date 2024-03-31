import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, List, Menu, MenuItem } from '@mui/material';

import Info from './FeatureInfo';
import { setOpen } from './slice';

function getKeyCombine(event) {
  let combine = '';

  if (event.ctrlKey) combine += 'c';
  if (event.shiftKey) combine += 's';
  combine += 'r';

  return combine;
}

function ContextMenu({ menuList }) {
  const dispatch = useDispatch();
  const { interactionType } = useSelector((state) => state[Info.id].storage);
  const { mousePos, triggerList } = useSelector((state) => state[Info.id]);
  const gestureTrack = useRef({ right: false, count: 0 });
  const dblClickTack = useRef(false);
  const [targetTable, setTargetTable] = useState(undefined);

  useEffect(() => {
    const handleDown = ({ button }) => {
      if (button === 2) {
        gestureTrack.current.right = true;
        dispatch(setOpen(null));
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

      try {
        if (trackCount > 20) throw Error;
        if (dblClickTack.current) throw Error;
        if (getKeyCombine(e) !== interactionType) throw Error;
        let triggered = false;
        const entries = triggerList.map(({ key, selector }) => {
          const target = e.target.closest(selector);

          if (target) triggered = true;
          return [key, target];
        });

        if (!triggered) return;

        e.preventDefault();
        if (interactionType === 'r') dblClickTack.current = true;
        setTargetTable(Object.fromEntries(entries));
        dispatch(setOpen([e.clientX, e.clientY]));
      } catch (_) {
        dblClickTack.current = false;
      }
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
  }, [interactionType, triggerList, dispatch]);

  const handleClose = useCallback(() => {
    dblClickTack.current = false;
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
      open={!!mousePos}
      onClose={handleClose}
    >
      <List sx={{ paddingY: 0.5 }}>
        <MenuItem dense disabled>
          Arca Refresher
        </MenuItem>
      </List>
      {menuList.map(({ key, View }) => (
        <Box
          key={key}
          sx={{
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            '&:empty': {
              display: 'none',
            },
            '& .MuiList-root': {
              paddingY: 0.5,
            },
          }}
        >
          <View target={targetTable?.[key]} closeMenu={handleClose} />
        </Box>
      ))}
    </Menu>
  );
}

ContextMenu.propTypes = {
  menuList: PropTypes.array,
};

export default ContextMenu;
