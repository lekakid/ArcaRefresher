import { GM_info } from '$';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Dialog,
  Divider,
  Drawer,
  IconButton,
  List,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';

import { ModuleLoadBoundary } from 'error/ModuleLoadBoundary';

import DrawerGroup from './DrawerGroup';
import DrawerItem from './DrawerItem';
import { setOpen, setDrawer, setSelection, setGroup } from '../slice';
import info from '../info';
import PropTypes from 'prop-types';

// 그룹 정보 (feature/{GROUP_NAME}/group.jsx)
const groupInfos = import.meta.glob(
  ['/src/feature/*/group.jsx', '!/src/feature/_*/**'],
  { eager: true, import: 'default' },
);
const groupList = Object.values(groupInfos).sort((a, b) => a.order - b.order);

// 설정 메뉴 정보 (feature/{GROUP_NAME}/{FEATURE_NAME}/ConfigMenu/index.jsx)
const menuInfos = import.meta.glob(
  ['/src/feature/*/*/ConfigMenu/index.jsx', '!/src/feature/_*/**'],
  { eager: true, import: 'default' },
);
const menuList = Object.values(menuInfos).sort((a, b) => {
  // 그룹 정렬
  if (a.group.order - b.group.order > 0) return 1;
  if (a.group.order - b.group.order < 0) return -1;

  // 메뉴 정렬
  if (!a.order && !b.order) {
    if (a.label > b.label) return 1;
    if (a.label < b.label) return -1;
  }
  if (!a.order) return 1;
  if (!b.order) return -1;
  return a.order - b.order;
});

function ConfigMenuSideNavigation({ onConfigSelect }) {
  const dispatch = useDispatch();
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { group } = useSelector((state) => state[info.id]);

  const handleItemClick = useCallback(
    (key) => {
      onConfigSelect();
      dispatch(setSelection(key));
      if (mobile) dispatch(setDrawer(false));
    },
    [mobile, onConfigSelect, dispatch],
  );

  const handleGroupClick = useCallback(
    (key) => {
      dispatch(setGroup(key));
    },
    [dispatch],
  );

  const selectedGroup = group ?? groupList[0].id;

  return (
    <List disablePadding>
      <DrawerItem
        key="all"
        configKey="all"
        icon={<MenuIcon />}
        onClick={handleItemClick}
      >
        전체 설정
      </DrawerItem>
      <Divider />
      {groupList.map((g, index) => {
        const innerList = menuList
          .filter((m) => m.group === g)
          .map((m) => (
            <DrawerItem
              key={m.id}
              sx={{
                paddingLeft: g.label ? 4 : undefined,
              }}
              divider={m.order === -1}
              icon={<m.Icon />}
              configKey={m.id}
              onClick={handleItemClick}
            >
              {m.label}
            </DrawerItem>
          ));

        return (
          <Fragment key={g.id}>
            {g.label && (
              <DrawerGroup
                groupIcon={<g.Icon />}
                groupText={g.label}
                groupKey={g.id}
                open={g.id === selectedGroup}
                onClick={handleGroupClick}
              >
                {innerList}
                {groupList.length - 2 !== index && <Divider />}
              </DrawerGroup>
            )}
            {!g.label && (
              <>
                <Divider />
                {innerList}
              </>
            )}
          </Fragment>
        );
      })}
    </List>
  );
}

ConfigMenuSideNavigation.propTypes = {
  onConfigSelect: PropTypes.func,
};

function ConfigMenuDialog() {
  const dispatch = useDispatch();
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { open, opacity, drawer, selection } = useSelector(
    (state) => state[info.id],
  );

  const stackRoot = useRef(null);
  const [loadCount, setLoadCount] = useState(2);

  // 설정이 열려있는 동안 아카 단축키 무력화
  useEffect(() => {
    if (!open) return undefined;

    const blocker = (e) => {
      // 아카 단축키가 keydown 이벤트를 사용함
      e.stopPropagation();
    };

    document.addEventListener('keydown', blocker, true);
    return () => document.removeEventListener('keydown', blocker, true);
  }, [open]);

  // 전체 설정 렌더 조절
  useEffect(() => {
    if (!open) return;
    if (selection !== 'all') return;
    if (loadCount >= menuList.length) return;

    const id = requestAnimationFrame(() => setLoadCount((c) => c + 4));
    return () => cancelAnimationFrame(id);
  }, [open, loadCount, selection]);

  // 모바일 환경
  useEffect(() => {
    if (mobile) dispatch(setDrawer(false));
  }, [dispatch, mobile]);

  const handleConfigClose = useCallback(() => {
    if (mobile) dispatch(setDrawer(false));
    dispatch(setOpen(false));
    setLoadCount(2);
  }, [dispatch, mobile]);

  const handleDrawerToggle = useCallback(() => {
    dispatch(setDrawer(!drawer));
  }, [dispatch, drawer]);

  const content = menuList
    .filter(
      ({ id }, index) =>
        (selection === 'all' && index < loadCount) || selection === id,
    )
    .map(({ id, View }) => (
      <ModuleLoadBoundary
        key={id}
        moduleId={id}
        text={`[${id}] 설정을 불러오는 중 처리하지 못하는 오류가 발생했습니다.`}
      >
        <View />
      </ModuleLoadBoundary>
    ));

  return (
    <Dialog
      fullScreen={mobile}
      fullWidth
      maxWidth="md"
      slotProps={{
        backdrop: {
          invisible: opacity !== 1,
        },
        transition: {
          mountOnEnter: true,
        },
        paper: {
          sx: {
            aspectRatio: '9/7',
          },
          square: true,
          elevation: 0,
        },
      }}
      open={open}
      onClose={handleConfigClose}
    >
      <AppBar color="primary" position="relative">
        <Toolbar>
          {mobile && (
            <IconButton
              size="large"
              color="inherit"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            {`Arca Refresher ${GM_info.script.version}`}
          </Typography>
          <IconButton size="large" color="inherit" onClick={handleConfigClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Stack direction="row" sx={{ minHeight: 0, height: '100%' }}>
        <Drawer
          variant={mobile ? 'temporary' : 'permanent'}
          ModalProps={{ disablePortal: true, keepMounted: true }}
          slotProps={{
            paper: {
              sx: {
                position: 'relative',
                width: 240,
                sm: {
                  zIndex: (theme) => theme.zIndex.appBar - 1,
                },
              },
            },
          }}
          open={!mobile || drawer}
          onClose={handleDrawerToggle}
        >
          <ConfigMenuSideNavigation
            onConfigSelect={() => {
              stackRoot.current.scrollTo(0, 0);
              setLoadCount(2);
            }}
          />
        </Drawer>
        <Stack
          ref={stackRoot}
          sx={{
            width: '100%',
            padding: 3,
            overflowY: 'auto',
            gap: 1,
          }}
        >
          {content}
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default ConfigMenuDialog;
