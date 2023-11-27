import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  CircularProgress,
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
import { Close, Menu } from '@mui/icons-material';

import Info from './FeatureInfo';
import { setOpen, setDrawer } from './slice';
import HeaderButton from './HeaderButton';
import DrawerGroup from './DrawerGroup';
import DrawerItem from './DrawerItem';

function MenuContainer({ groupList, menuList }) {
  const dispatch = useDispatch();
  const { open, opacity, drawer, group, selection } = useSelector(
    (state) => state[Info.ID],
  );
  const [loadCount, setLoadCount] = useState(3);
  const [target, setTarget] = useState(undefined);
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  // 설정이 열려있는 동안 아카 단축키 무력화
  useEffect(() => {
    if (!open) return undefined;

    const blocker = (e) => {
      // 아카 단축키가 keydown 이벤트를 사용함
      e.stopPropagation();
    };

    document.addEventListener('keydown', blocker, true);
    return () => document.addEventListener('keydown', blocker, true);
  }, [open]);

  // 전체 설정 조회 시 사용되는 스크롤 관련 옵저버
  useEffect(() => {
    if (!target) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        setLoadCount((prev) => prev + 1);
        observer.observe(entry.target);
      }
    });
    observer.observe(target);

    return () => observer.disconnect();
  }, [target]);

  // 모바일 환경
  useEffect(() => {
    if (mobile) dispatch(setDrawer(false));
  }, [dispatch, mobile]);

  const handleConfigClose = useCallback(() => {
    if (mobile) dispatch(setDrawer(false));
    setLoadCount(1);
    dispatch(setOpen(false));
  }, [dispatch, mobile]);

  const handleDrawerToggle = useCallback(() => {
    dispatch(setDrawer(!drawer));
  }, [dispatch, drawer]);

  const navi = [
    ...groupList.map(({ key, label, Icon: GroupIcon }, index) => (
      <DrawerGroup
        key={key}
        groupKey={key}
        groupIcon={<GroupIcon />}
        open={(group === '' && index === 0) || group === key}
        groupText={label}
      >
        {menuList
          .filter(({ group: groupKey }) => groupKey === key)
          .map(({ key: menuKey, label: menuLabel, Icon }) => (
            <DrawerItem
              key={menuKey}
              sx={{
                paddingLeft: 4,
              }}
              configKey={menuKey}
              icon={<Icon />}
            >
              {menuLabel}
            </DrawerItem>
          ))}
      </DrawerGroup>
    )),
    <Divider key="d1" />,
    menuList
      .filter(({ group: groupKey }) => !groupKey)
      .map(({ key: menuKey, label: menuLabel, Icon }) => (
        <DrawerItem key={menuKey} configKey={menuKey} icon={<Icon />}>
          {menuLabel}
        </DrawerItem>
      )),
  ];

  let content = null;
  if (selection === 'all') {
    const sortedMenuList = groupList
      .map(({ key }) =>
        menuList.filter(({ group: groupKey }) => groupKey === key),
      )
      .flat();
    sortedMenuList.push(...menuList.filter(({ group: groupKey }) => !groupKey));
    content = sortedMenuList
      .filter((_value, index) => index < loadCount)
      .map(({ key, View }) => <View key={key} />);
  } else {
    content = menuList.map(
      ({ key, View }) => selection === key && <View key={key} />,
    );
  }

  return (
    <>
      <Dialog
        fullScreen={mobile}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            aspectRatio: '9/7',
            opacity,
          },
          square: true,
          elevation: 0,
        }}
        TransitionProps={{
          mountOnEnter: true,
        }}
        slotProps={{
          backdrop: {
            invisible: opacity !== 1,
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
                <Menu />
              </IconButton>
            )}
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              {`Arca Refresher ${GM_info.script.version}`}
            </Typography>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleConfigClose}
            >
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Stack direction="row" sx={{ minHeight: 0, height: '100%' }}>
          <Drawer
            variant={mobile ? 'temporary' : 'permanent'}
            PaperProps={{
              sx: {
                position: 'relative',
                width: 240,
                sm: {
                  zIndex: (theme) => theme.zIndex.appBar - 1,
                },
              },
            }}
            ModalProps={{ disablePortal: true, keepMounted: true }}
            open={!mobile || drawer}
            onClose={handleDrawerToggle}
          >
            <List disablePadding>
              <DrawerItem key="all" configKey="all" icon={<Menu />}>
                전체 설정
              </DrawerItem>
              <Divider />
              {navi}
            </List>
          </Drawer>
          <Stack
            sx={{
              width: '100%',
              padding: 3,
              overflowY: 'auto',
              gap: 1,
            }}
          >
            {content}
            {selection === 'all' && loadCount < menuList.length && (
              <Box
                ref={setTarget}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '32px',
                }}
              >
                <CircularProgress />
              </Box>
            )}
          </Stack>
        </Stack>
      </Dialog>
      <HeaderButton />
    </>
  );
}

MenuContainer.displayName = 'ConfigMenuContainer';

export default MenuContainer;
