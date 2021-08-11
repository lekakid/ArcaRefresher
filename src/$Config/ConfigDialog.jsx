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
import { setDialogOpen } from './slice';
import useConfigStyles from './useConfigStyles';
import ConfigListButton from './ConfigListButton';

export default function ConfigView() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { menuList, dialogOpen, selection } = useSelector(
    (state) => state[MODULE_ID],
  );
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(!mobile);

  const handleConfigClose = useCallback(() => {
    setDrawerOpen(false);
    dispatch(setDialogOpen(false));
  }, [dispatch]);

  const handleDrawerToggle = useCallback(() => {
    setDrawerOpen((prev) => !prev);
  }, []);

  const classes = useConfigStyles();
  const drawer = (
    <>
      <div className={classes.toolbar} />
      <Divider />
      <List disablePadding>
        <ConfigListButton configKey="all" icon={<Menu />} text="전체 설정" />
        <Divider />
        {Object.values(menuList).map(({ listButton }) => (
          <Typography variant="h5">{listButton}</Typography>
        ))}
      </List>
    </>
  );

  return (
    <Dialog
      fullScreen
      className={classes.root}
      PaperProps={{
        className: classes.bg,
      }}
      open={dialogOpen}
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
            {drawer}
          </Drawer>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {selection === 'all' &&
            Object.values(menuList).map(({ content }) => content)}
          {selection !== 'all' && menuList[selection]?.content}
        </main>
      </Container>
    </Dialog>
  );
}
