import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Container,
  Dialog,
  Divider,
  Drawer,
  IconButton,
  List,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { ChevronLeft, Close, Menu } from '@material-ui/icons';

import { MODULE_ID } from './ModuleInfo';
import { setOpen, setDrawer } from './slice';
import useStyles from './useStyles';
import HeaderButton from './HeaderButton';
import ConfigListGroup from './ConfigListGroup';
import ConfigListButton from './ConfigListButton';

export default function ConfigMenu({ groupList, menuList }) {
  const dispatch = useDispatch();
  const { open, drawer, selection } = useSelector((state) => state[MODULE_ID]);
  const intersectionObserver = useRef(null);
  const [loadCount, setLoadCount] = useState(1);
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const classes = useStyles();

  useEffect(() => {
    intersectionObserver.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLoadCount((prev) => prev + 1);
      }
    });
  }, []);

  useEffect(() => {
    if (mobile) dispatch(setDrawer(false));
  }, [dispatch, mobile]);

  const handleTarget = useCallback((element) => {
    if (element) intersectionObserver.current.observe(element);
  }, []);

  const handleConfigClose = useCallback(() => {
    if (mobile) dispatch(setDrawer(false));
    setLoadCount(1);
    dispatch(setOpen(false));
  }, [dispatch, mobile]);

  const handleDrawerToggle = useCallback(() => {
    dispatch(setDrawer(!drawer));
  }, [dispatch, drawer]);

  const navi = [
    ...groupList.map(({ key, icon, label }) => (
      <ConfigListGroup
        key={key}
        groupKey={key}
        groupIcon={icon}
        groupText={label}
      >
        {menuList
          .filter(({ group }) => group === key)
          .map(({ key: menuKey, ListButton }) => (
            <ListButton
              key={`ListButton.${menuKey}`}
              className={classes.nested}
            />
          ))}
      </ConfigListGroup>
    )),
    <Divider key="d1" />,
    menuList
      .filter(({ group }) => !group)
      .map(({ key: menuKey, ListButton }) => (
        <ListButton key={`ListButton.${menuKey}`} />
      )),
  ];

  let content = null;
  if (selection === 'all') {
    content = menuList
      .filter((_value, index) => index < loadCount)
      .map(({ key, View }) => <View ref={handleTarget} key={key} />);
  } else {
    content = menuList.map(
      ({ key, View }) => selection === key && <View key={key} />,
    );
  }

  return (
    <>
      <Dialog
        fullScreen
        className={classes.root}
        PaperProps={{
          className: classes.bg,
        }}
        TransitionProps={{
          mountOnEnter: true,
        }}
        open={open}
        onClose={handleConfigClose}
      >
        <Container maxWidth="md">
          <AppBar color="secondary" position="fixed">
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
                Arca Refresher
              </Typography>
              <IconButton color="inherit" onClick={handleConfigClose}>
                <Close />
              </IconButton>
            </Toolbar>
          </AppBar>
          <nav>
            <Drawer
              variant={mobile ? 'temporary' : 'permanent'}
              classes={{ paper: classes.drawer }}
              ModalProps={{ keepMounted: true }}
              open={!mobile || drawer}
              onClose={handleDrawerToggle}
            >
              <div className={classes.toolbar}>
                {mobile && (
                  <IconButton onClick={handleDrawerToggle}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </div>
              <Divider />
              <List disablePadding>
                <ConfigListButton key="all" configKey="all" icon={<Menu />}>
                  전체 설정
                </ConfigListButton>
                <Divider />
                {navi}
              </List>
            </Drawer>
          </nav>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            {content}
          </main>
        </Container>
      </Dialog>
      <HeaderButton />
    </>
  );
}
