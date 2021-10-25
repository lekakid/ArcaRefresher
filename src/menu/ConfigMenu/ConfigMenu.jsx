import React, { useCallback, useState } from 'react';
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
import { setOpen } from './slice';
import useStyles from './useStyles';
import HeaderButton from './HeaderButton';
import ConfigListGroup from './ConfigListGroup';
import ConfigListButton from './ConfigListButton';

export default function ConfigMenu({ groupList, menuList }) {
  const dispatch = useDispatch();
  const { open, selection } = useSelector((state) => state[MODULE_ID]);
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loadIndex, setLoadIndex] = useState(0);
  const [intersectionTarget, setIntersectionTarget] = useState(null);
  const classes = useStyles();

  const handleIntersection = useCallback(
    (element) => {
      if (!intersectionTarget) return undefined;

      const intersectionObserver = new IntersectionObserver(
        ([entry], observer) => {
          if (entry.isIntersecting) {
            setLoadIndex((prev) => prev + 1);
            observer.unobserve(intersectionTarget);
          }
        },
        {
          root: element,
        },
      );

      intersectionObserver.observe(intersectionTarget);
      return () => intersectionObserver.unobserve(intersectionTarget);
    },
    [intersectionTarget],
  );

  const handleTarget = useCallback((element) => {
    setIntersectionTarget(element);
  }, []);

  const handleConfigClose = useCallback(() => {
    setDrawerOpen(false);
    setLoadIndex(0);
    dispatch(setOpen(false));
  }, [dispatch]);

  const handleDrawerToggle = useCallback(() => {
    setDrawerOpen((prev) => !prev);
  }, []);

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

  const content = menuList.map(
    ({ key, View }, index) =>
      ((selection === 'all' && index <= loadIndex) || selection === key) && (
        <View ref={index === loadIndex ? handleTarget : null} key={key} />
      ),
  );

  return (
    <>
      <Dialog
        ref={handleIntersection}
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
              open={!mobile || drawerOpen}
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
