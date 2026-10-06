import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, List, Menu, MenuItem } from '@mui/material';

import { ModuleLoadBoundary } from 'error/ModuleLoadBoundary';

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

  const gestureRef = useRef({ right: false, count: 0 });
  const openRef = useRef(false);
  const [targetTable, setTargetTable] = useState(undefined);

  useEffect(() => {
    const handleDown = ({ button }) => {
      if (button === 2) {
        gestureRef.current.right = true;
        dispatch(setOpen(null));
      }
    };
    const handleUp = ({ button }) => {
      if (button === 2) gestureRef.current.right = false;
    };
    const handleMove = () => {
      if (gestureRef.current.right) gestureRef.current.count += 1;
    };
    const handleScroll = () => {
      openRef.current = false;
      dispatch(setOpen(null));
    };
    const handleContext = (e) => {
      const { count: trackCount } = gestureRef.current;
      gestureRef.current.count = 0;

      // 오른쪽 클릭만으로 동작하는 상태에서 메뉴가 이미 열려있는 경우
      if (interactionType === 'r' && openRef.current) {
        openRef.current = false;
        return;
      }
      // 오른쪽 클릭 제스쳐 사용 시
      if (trackCount > 20) return;
      // 조합이 안 맞는 경우
      if (getKeyCombine(e) !== interactionType) return;

      try {
        let triggered = false;
        const entries = triggerList.map(({ key, selector }) => {
          const target = e.target.closest(selector);

          if (target) triggered = true;
          return [key, target];
        });

        if (!triggered) return;

        e.preventDefault();
        openRef.current = true;
        setTargetTable(Object.fromEntries(entries));
        dispatch(setOpen([e.clientX, e.clientY]));
      } catch (_) {
        /* empty */
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
    openRef.current = false;
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
      slotProps={{
        list: { disablePadding: true },
      }}
      transitionDuration={{ enter: 150, exit: 0 }}
      open={!!mousePos}
      onClose={handleClose}
    >
      <List sx={{ paddingY: 0.5 }}>
        <MenuItem dense disabled>
          Arca Refresher
        </MenuItem>
      </List>
      {menuList.map(({ key, View }) => (
        <ModuleLoadBoundary
          key={key}
          moduleId={key}
          text={`[${key}] 기능의 우클릭 메뉴에 오류가 발생해 해당 기능이 중단됐습니다.`}
        >
          <Box
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
        </ModuleLoadBoundary>
      ))}
    </Menu>
  );
}

ContextMenu.propTypes = {
  menuList: PropTypes.array,
};

export default ContextMenu;
