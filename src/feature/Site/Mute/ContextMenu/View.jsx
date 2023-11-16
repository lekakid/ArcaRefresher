import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Block, Redo } from '@material-ui/icons';

import { BOARD_ITEMS_WITH_NOTICE, USER_INFO } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';
import { useSnackbarAlert } from 'menu/SnackbarAlert';
import { getUserID } from 'func/user';

import {
  getEmoticonList,
  getBundleID,
  getBundleName,
  trimEmotURL,
} from '../func';
import { $addEmoticon, $addUser, $removeEmoticon, $removeUser } from '../slice';
import Info from '../FeatureInfo';

function makeRegex(id) {
  return `${id.replace('.', '\\.')}$`;
}

function ContextMenu({ target }) {
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

  const setSnack = useSnackbarAlert();
  const emotSelector =
    '[class$="emoticon"], .emoticon-wrapper > span, .article-body a.muted';
  const [data, closeMenu] = useContextMenu(
    {
      key: Info.ID,
      selector: `${contextSelector}, ${emotSelector}`,
      dataExtractor: () => {
        if (!target) return undefined;

        if (target.matches(contextSelector)) {
          let userElement = target;
          if (target.matches('.vrow')) {
            userElement = target.querySelector('span.user-info');
          }
          if (!userElement) return undefined;

          const regex = makeRegex(getUserID(userElement));
          const exist = user.includes(regex);
          return { type: 'user', regex, exist };
        }

        if (target.matches(emotSelector)) {
          let emotElement = target;
          let muted = false;
          if (target.matches('span.muted')) {
            emotElement = target.parentElement.querySelector('.emoticon');
            muted = true;
          }
          if (target.matches('a.muted')) {
            emotElement = target.querySelector('[class$="emoticon"]');
            muted = true;
          }
          return {
            type: 'emoticon',
            muted,
            bundleID: emotElement.dataset.storeId,
            emotID: parseInt(emotElement.dataset.id, 10),
            url: trimEmotURL(emotElement.src),
          };
        }

        return undefined;
      },
    },
    [target, user],
  );

  const handleBundleMute = useCallback(() => {
    (async () => {
      try {
        let { bundleID } = data;
        const { emotID, url } = data;
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
  }, [closeMenu, data, dispatch, setSnack]);

  const handleSingleMute = useCallback(() => {
    (async () => {
      try {
        let { bundleID, emotID } = data;
        const { url } = data;
        if (!bundleID) {
          bundleID = await getBundleID(emotID);
        }
        if (!emotID) {
          const bundle = await getEmoticonList(bundleID);
          const index = bundle.urlList.indexOf(url);
          emotID = bundle.idList[index];
        }
        const bundleName = await getBundleName(bundleID);

        dispatch(
          $addEmoticon({
            id: bundleID,
            emoticon: {
              name: bundleName,
              bundle: [emotID || -1],
              url: [url],
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
  }, [closeMenu, data, dispatch, setSnack]);

  const handleBundleUnmute = useCallback(() => {
    (async () => {
      try {
        let { bundleID } = data;
        const { emotID } = data;
        if (!bundleID) {
          bundleID = await getBundleID(emotID);
        }

        dispatch(
          $removeEmoticon({
            id: bundleID,
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
  }, [closeMenu, data, dispatch, setSnack]);

  const handleSingleUnmute = useCallback(() => {
    (async () => {
      try {
        let { bundleID } = data;
        const { emotID, url } = data;
        if (!bundleID) {
          bundleID = await getBundleID(emotID);
        }

        dispatch(
          $removeEmoticon({
            id: bundleID,
            emotID,
            url,
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
  }, [closeMenu, data, dispatch, setSnack]);

  const handleMute = useCallback(() => {
    const { regex, exist } = data;

    dispatch(exist ? $removeUser(regex) : $addUser(regex));
    closeMenu();
  }, [data, dispatch, closeMenu]);

  if (data?.type === 'emoticon') {
    return (
      <>
        {!data.muted && (
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
        {data.muted && (
          <List>
            <MenuItem onClick={handleBundleUnmute}>
              <ListItemIcon>
                <Block />
              </ListItemIcon>
              <Typography>아카콘 묶음 뮤트 해제</Typography>
            </MenuItem>
            <MenuItem onClick={handleSingleUnmute}>
              <ListItemIcon>
                <Block />
              </ListItemIcon>
              <Typography>이 아카콘만 뮤트 해제</Typography>
            </MenuItem>
          </List>
        )}
      </>
    );
  }

  if (data?.type === 'user') {
    return (
      <List>
        <MenuItem onClick={handleMute}>
          <ListItemIcon>{data.exist ? <Redo /> : <Block />}</ListItemIcon>
          <Typography>
            {data.exist ? '사용자 뮤트 해제' : '사용자 뮤트'}
          </Typography>
        </MenuItem>
      </List>
    );
  }

  return null;
}

export default ContextMenu;
