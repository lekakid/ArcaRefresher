import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Block, Redo } from '@material-ui/icons';

import { useContextMenu, useContextSnack } from 'menu/ContextMenu';
import { BOARD_ITEMS_WITH_NOTICE, USER_INFO } from 'core/selector';
import { getUserInfo } from 'func/user';

import { getEmoticonList, getBundleName, trimEmotURL } from '../func';
import { $addEmoticon, $addUser, $removeUser } from '../slice';
import getBundleID from '../func/getBundleID';
import Info from '../FeatureInfo';

function makeRegex(id = '') {
  return `${id.replace('.', '\\.')}$`;
}

function View({ targetRef }) {
  const dispatch = useDispatch();
  const { user, contextRange } = useSelector((state) => state[Info.ID].storage);
  let contextSelector;
  switch (contextRange) {
    case 'articleItem':
      contextSelector = `${BOARD_ITEMS_WITH_NOTICE}, ${USER_INFO}`;
      break;
    case 'nickname':
      contextSelector = USER_INFO;
      break;
    default:
      console.warn('[Mute] contextRange 값이 올바르지 않음');
      contextSelector = USER_INFO;
  }

  const setSnack = useContextSnack();
  const [emotData, closeMenu] = useContextMenu({
    targetRef,
    selector: '[class$="emoticon"]',
    dataExtractor: (target) => ({
      bundleID: target.dataset.storeId,
      emotID: target.dataset.id,
      url: target.src.replace('https:', ''),
    }),
  });

  const [userData] = useContextMenu({
    targetRef,
    selector: contextSelector,
    dataExtractor: (target) => {
      let userElement = target;
      if (target.matches('.vrow')) {
        userElement = target.querySelector('span.user-info');
      }
      if (!userElement) return undefined;

      const regex = makeRegex(getUserInfo(userElement));
      const exist = user.includes(regex);
      return { regex, exist };
    },
  });

  const handleBundleMute = useCallback(() => {
    (async () => {
      try {
        let { bundleID } = emotData;
        const { emotID, url } = emotData;
        if (!bundleID) {
          bundleID = await getBundleID(emotID);
        }
        const bundleName = await getBundleName(bundleID);
        const { idList, urlList } = await getEmoticonList(bundleID);

        if (idList.length === 0) {
          dispatch(
            $addEmoticon({
              id: bundleID,
              emoticon: {
                name: bundleName,
                bundle: [parseInt(emotID, 10)],
                url: [trimEmotURL(url)],
              },
            }),
          );
        } else {
          dispatch(
            $addEmoticon({
              id: bundleID,
              emoticon: { name: bundleName, bundle: idList, url: urlList },
            }),
          );
        }
      } catch (e) {
        setSnack({
          msg: `${e.message}\n개발자 도구(F12)의 콘솔(Console)창 캡쳐와 함께 문의바랍니다.`,
          time: 3000,
        });
        console.error(e);
      }

      closeMenu();
    })();
  }, [closeMenu, emotData, dispatch, setSnack]);

  const handleSingleMute = useCallback(() => {
    (async () => {
      try {
        let { bundleID } = emotData;
        const { emotID, url } = emotData;
        if (!bundleID) {
          bundleID = await getBundleID(emotID);
        }
        const bundleName = await getBundleName(bundleID);

        dispatch(
          $addEmoticon({
            id: bundleID,
            emoticon: {
              name: bundleName,
              bundle: [parseInt(emotID, 10)],
              url: [trimEmotURL(url)],
            },
          }),
        );
      } catch (e) {
        setSnack({
          msg: `${e.message}\n개발자 도구(F12)의 콘솔(Console)창 캡쳐와 함께 문의바랍니다.`,
          time: 3000,
        });
        console.error(e);
      }

      closeMenu();
    })();
  }, [closeMenu, emotData, dispatch, setSnack]);

  const handleMute = useCallback(() => {
    const { regex, exist } = emotData;

    dispatch(exist ? $removeUser(regex) : $addUser(regex));
    closeMenu();
  }, [emotData, dispatch, closeMenu]);

  return (
    <>
      {emotData && (
        <List>
          <MenuItem onClick={handleBundleMute}>
            <ListItemIcon>
              <Block />
            </ListItemIcon>
            <Typography>아카콘 묶음 뮤트</Typography>
          </MenuItem>
          <MenuItem onClick={handleSingleMute}>
            <ListItemIcon>
              <Block />
            </ListItemIcon>
            <Typography>이 아카콘만 뮤트</Typography>
          </MenuItem>
        </List>
      )}
      {userData && (
        <List>
          <MenuItem onClick={handleMute}>
            <ListItemIcon>{userData.exist ? <Redo /> : <Block />}</ListItemIcon>
            <Typography>
              {userData.exist ? '사용자 뮤트 해제' : '사용자 뮤트'}
            </Typography>
          </MenuItem>
        </List>
      )}
    </>
  );
}

export default View;
