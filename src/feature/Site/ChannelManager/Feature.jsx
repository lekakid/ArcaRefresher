import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Collapse,
  Divider,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Portal,
} from '@mui/material';
import { Folder } from '@mui/icons-material';

import { NAVIGATION_LOADED } from 'core/selector';
import { useLoadChecker } from 'hooks/LoadChecker';

import { stringifyQuery } from 'func/http';
import SubsChannelManager from './SubsChannelManager';
import { setNavChannelInfo } from './slice';
import Info from './FeatureInfo';

function ListFolder({ group, children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ListItem dense disablePadding>
        <ListItemButton onClick={() => setOpen((prev) => !prev)}>
          <ListItemIcon>
            <Folder />
          </ListItemIcon>
          <ListItemText disableTypography primary={group} />
        </ListItemButton>
      </ListItem>
      <Collapse in={open}>
        <List disablePadding>{children}</List>
      </Collapse>
    </>
  );
}

ListFolder.propTypes = {
  group: PropTypes.string,
  children: PropTypes.node,
};

function ChannelItem({ id, label, info }) {
  const search = {};
  if (info?.best) search.mode = 'best';
  if (info?.cut > 0) search.cut = info.cut;

  return (
    <ListItem dense disablePadding>
      <ListItemButton
        component={Link}
        href={`/b/${id}${stringifyQuery(search)}`}
      >
        <ListItemText
          disableTypography
          primary={`${label}${info?.memo ? ` - ${info.memo}` : ''}`}
        />
      </ListItemButton>
    </ListItem>
  );
}

ChannelItem.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  info: PropTypes.object,
};

export default function ChannelManager() {
  const dispatch = useDispatch();
  const navLoaded = useLoadChecker(NAVIGATION_LOADED);

  const { enabled, groupList, channelInfoTable } = useSelector(
    (state) => state[Info.id].storage,
  );
  const { navChannelInfo } = useSelector((state) => state[Info.id]);
  const [container, setContainer] = useState();
  const subRef = useRef(undefined);
  const [open, setOpen] = useState({ subs: false, main: false, editor: false });

  useEffect(() => {
    if (!navLoaded) return undefined;
    if (!enabled) return undefined;
    if (window.location.pathname.includes('/w/')) return undefined;

    const nav = document.querySelector('nav .nav');
    const subsElement = nav.firstElementChild;

    subsElement.style.display = 'none';
    const subs = [
      ...subsElement.querySelectorAll(
        'a.dropdown-item:not([href="/b/my"]):not([href="#"])',
      ),
    ].map((a) => ({
      label: a.firstElementChild.textContent,
      id: a.pathname.split('/').pop(),
    }));
    dispatch(setNavChannelInfo({ subs }));

    const mainContainer = document.createElement('li');
    mainContainer.classList.add('nav-item', 'dropdown');
    const subsContainer = document.createElement('li');
    subsContainer.classList.add('nav-item', 'dropdown');

    nav.insertAdjacentElement('afterbegin', mainContainer);
    nav.insertAdjacentElement('afterbegin', subsContainer);
    setContainer({ subs: subsContainer, main: mainContainer });
    return () => {
      subsElement.style.removeProperty('display');
      subsContainer.remove();
      mainContainer.remove();
      setContainer(undefined);
    };
  }, [navLoaded, enabled, dispatch]);

  const handleSubClick = useCallback((e) => {
    e.preventDefault();
    setOpen((prev) => ({
      ...prev,
      subs: true,
    }));
  }, []);

  const handleSubClose = useCallback(() => {
    setOpen((prev) => ({
      ...prev,
      subs: false,
    }));
  }, []);

  if (!enabled) return null;

  let groupChildren;
  if (groupList.length > 0) {
    groupChildren = (
      <>
        <Divider />
        <List>
          {groupList.map((group) => {
            const filteredChannel = navChannelInfo.subs.filter(({ id }) =>
              channelInfoTable[id]?.groups.includes(group),
            );

            return (
              <ListFolder key={group} group={group}>
                {filteredChannel.length === 0 && (
                  <ListItem dense>이 그룹은 비어있습니다.</ListItem>
                )}
                {filteredChannel.map(({ label, id }) => (
                  <ChannelItem
                    key={id}
                    id={id}
                    label={label}
                    info={channelInfoTable[id]}
                  />
                ))}
              </ListFolder>
            );
          })}
        </List>
      </>
    );
  }

  const remainChannels = navChannelInfo.subs.filter(
    ({ id }) => !(channelInfoTable[id]?.groups.length > 0),
  );

  let remainChannelChildren;
  if (remainChannels.length > 0) {
    remainChannelChildren = (
      <>
        <Divider />
        <List>
          {remainChannels.map(({ label, id }) => (
            <ChannelItem
              key={id}
              id={id}
              label={label}
              memo={channelInfoTable[id]?.memo || ''}
              best={channelInfoTable[id]?.best}
            />
          ))}{' '}
        </List>
      </>
    );
  } else if (groupList.length === 0) {
    remainChannelChildren = (
      <>
        <Divider />
        <List>
          <ListItem>구독 채널이 없습니다.</ListItem>
        </List>
      </>
    );
  }

  return (
    <>
      {container?.subs && (
        <Portal container={container.subs}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a
            ref={subRef}
            aria-expanded="false"
            className="nav-link dropdown-toggle"
            href="#"
            onClick={handleSubClick}
          >
            구독
            <span className="d-none d-md-inline"> </span>
            <span className="d-none d-md-inline">채널</span>
            {'\n'}
          </a>
          <Popover
            anchorEl={subRef.current}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'center', vertical: 'top' }}
            transitionDuration={150}
            disableScrollLock
            open={open.subs}
            onClose={handleSubClose}
          >
            <List>
              <ListItem dense disablePadding>
                <ListItemButton
                  onClick={() =>
                    setOpen((prev) => ({ ...prev, subs: false, editor: true }))
                  }
                >
                  <ListItemText disableTypography primary="그룹 편집" />
                </ListItemButton>
              </ListItem>
              <ListItem dense disablePadding>
                <ListItemButton component={Link} href="/b/my">
                  <ListItemText disableTypography primary="구독 중인 채널" />
                </ListItemButton>
              </ListItem>
            </List>
            {groupChildren}
            {remainChannelChildren}
          </Popover>
        </Portal>
      )}
      <SubsChannelManager
        subs={navChannelInfo.subs}
        open={open.editor}
        onClose={() => setOpen((prev) => ({ ...prev, editor: false }))}
      />
    </>
  );
}
