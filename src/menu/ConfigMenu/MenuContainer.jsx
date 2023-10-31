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
  Toolbar,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Close, Menu } from '@material-ui/icons';

import Info from './FeatureInfo';
import { setOpen, setDrawer } from './slice';
import Styles from './Styles';
import HeaderButton from './HeaderButton';
import DrawerGroup from './DrawerGroup';
import DrawerItem from './DrawerItem';

function MenuContainer({ classes, groupList, menuList }) {
  const dispatch = useDispatch();
  const { open, opacity, drawer, group, selection } = useSelector(
    (state) => state[Info.ID],
  );
  const [loadCount, setLoadCount] = useState(3);
  const [target, setTarget] = useState(undefined);
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

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
    ...groupList.map(({ key, icon, label }, index) => (
      <DrawerGroup
        key={key}
        groupKey={key}
        groupIcon={icon}
        open={(group === '' && index === 0) || group === key}
        groupText={label}
      >
        {menuList
          .filter(({ group: groupKey }) => groupKey === key)
          .map(({ key: menuKey, label: menuLabel, Icon }) => (
            <DrawerItem
              key={menuKey}
              className={classes.nested}
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
        className={classes.root}
        PaperProps={{
          className: classes.bg,
          style: { opacity },
          square: true,
        }}
        BackdropProps={{
          invisible: opacity !== 1,
        }}
        TransitionProps={{
          mountOnEnter: true,
        }}
        open={open}
        onClose={handleConfigClose}
      >
        <AppBar color="secondary" position="relative">
          <Toolbar>
            {mobile && (
              <IconButton
                edge="start"
                color="inherit"
                className={classes.menuButton}
                onClick={handleDrawerToggle}
              >
                <Menu />
              </IconButton>
            )}
            <Typography variant="h5" noWrap className={classes.title}>
              {`Arca Refresher ${GM_info.script.version}`}
            </Typography>
            <IconButton color="inherit" onClick={handleConfigClose}>
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box display="flex" minHeight={0} flexGrow={1}>
          <Drawer
            variant={mobile ? 'temporary' : 'permanent'}
            classes={{ paper: classes.drawer }}
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
          <main className={classes.content}>
            {content}
            {selection === 'all' && loadCount < menuList.length && (
              <Box
                ref={setTarget}
                display="flex"
                justifyContent="center"
                marginTop={4}
              >
                <CircularProgress />
              </Box>
            )}
          </main>
        </Box>
      </Dialog>
      <HeaderButton />
    </>
  );
}

MenuContainer.displayName = 'ConfigMenuContainer';

export default withStyles(Styles)(MenuContainer);
