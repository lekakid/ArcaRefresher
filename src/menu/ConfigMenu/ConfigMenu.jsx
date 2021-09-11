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
  useTheme,
} from '@material-ui/core';
import { Close, Menu } from '@material-ui/icons';

import { MODULE_ID } from './ModuleInfo';
import { setOpen } from './slice';
import useStyles from './useStyles';
import ConfigListButton from './ConfigListButton';
import HeaderButton from './HeaderButton';

export default function ConfigMenu({ menuList }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { open, selection } = useSelector((state) => state[MODULE_ID]);
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(!mobile);
  const classes = useStyles();

  const handleConfigClose = useCallback(() => {
    setDrawerOpen(false);
    dispatch(setOpen(false));
  }, [dispatch]);

  const handleDrawerToggle = useCallback(() => {
    setDrawerOpen((prev) => !prev);
  }, []);

  const list = menuList.map(({ key, ListButton }) => (
    <ListButton key={`ListButton.${key}`} />
  ));

  const content = menuList.map(
    ({ key, View }) =>
      (selection === 'all' || selection === key) && <View key={key} />,
  );

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
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              {mobile && (
                <IconButton
                  edge="start"
                  className={classes.menuButton}
                  onClick={handleDrawerToggle}
                >
                  <Menu />
                </IconButton>
              )}
              <Typography variant="h5" noWrap className={classes.title}>
                Arca Refresher
              </Typography>
              <IconButton onClick={handleConfigClose}>
                <Close />
              </IconButton>
            </Toolbar>
          </AppBar>
          <nav className={classes.drawer}>
            <Drawer
              variant={mobile ? 'temporary' : 'permanent'}
              classes={{ paper: classes.drawerPaper }}
              ModalProps={{ keepMounted: true }}
              open={drawerOpen}
              onClose={handleDrawerToggle}
            >
              <div className={classes.toolbar} />
              <Divider />
              <List disablePadding>
                <ConfigListButton key="all" configKey="all" icon={<Menu />}>
                  전체 설정
                </ConfigListButton>
                <Divider />
                {list}
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
