import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { Block, Redo } from '@mui/icons-material';

import {
  BOARD_ITEMS_WITH_NOTICE,
  USER_INFO,
  USER_MENTION,
} from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';
import { useSnackbarAlert } from 'menu/SnackbarAlert';
import { ArcaUser } from 'func/user';

import {
  getEmoticonList,
  getBundleId,
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
  const { user, contextRange } = useSelector((state) => state[Info.id].storage);
  let contextSelector;
  switch (contextRange) {
    case 'articleItem':
      contextSelector = `${BOARD_ITEMS_WITH_NOTICE}, ${USER_INFO}, ${USER_MENTION}`;
      break;
    case 'nickname':
      contextSelector = `${USER_INFO}, ${USER_MENTION}`;
      break;
    default:
      console.warn('[Mute] contextRange 값이 올바르지 않음');
      contextSelector = `${USER_INFO}, ${USER_MENTION}`;
      break;
  }

  const setSnack = useSnackbarAlert();
  const emotSelector =
    '[class$="emoticon"], .emoticon-wrapper > span, .article-body a.muted';
  const [data, closeMenu] = useContextMenu(
    {
      key: Info.id,
      selector: `${contextSelector}, ${emotSelector}`,
      dataExtractor: () => {
        if (!target) return undefined;

        if (target.matches(contextSelector)) {
          let userElement = target;
          if (target.matches('.vrow')) {
            userElement = target.querySelector('span.user-info');
          }
          if (!userElement) return undefined;

          const regex = makeRegex(new ArcaUser(userElement).toUID());
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
            bundleId: emotElement.dataset.storeId,
            emotId: parseInt(emotElement.dataset.id, 10),
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
        let { bundleId } = data;
        const { emotId, url } = data;
        if (!bundleId) {
          bundleId = await getBundleId(emotId);
        }
        const bundleName = await getBundleName(bundleId);
        const { idList, urlList } = await getEmoticonList(bundleId);

        if (idList.length === 0) {
          dispatch(
            $addEmoticon({
              id: bundleId,
              emoticon: {
                name: bundleName,
                bundle: [parseInt(emotId, 10)],
                url: [trimEmotURL(url)],
              },
            }),
          );
        } else {
          dispatch(
            $addEmoticon({
              id: bundleId,
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
        let { bundleId, emotId } = data;
        const { url } = data;
        if (!bundleId) {
          bundleId = await getBundleId(emotId);
        }
        if (!emotId) {
          const bundle = await getEmoticonList(bundleId);
          const index = bundle.urlList.indexOf(url);
          emotId = bundle.idList[index];
        }
        const bundleName = await getBundleName(bundleId);

        dispatch(
          $addEmoticon({
            id: bundleId,
            emoticon: {
              name: bundleName,
              bundle: [emotId || -1],
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
        let { bundleId } = data;
        const { emotId } = data;
        if (!bundleId) {
          bundleId = await getBundleId(emotId);
        }

        dispatch(
          $removeEmoticon({
            id: bundleId,
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
        let { bundleId } = data;
        const { emotId, url } = data;
        if (!bundleId) {
          bundleId = await getBundleId(emotId);
        }

        dispatch(
          $removeEmoticon({
            id: bundleId,
            emotId,
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

ContextMenu.propTypes = {
  target: PropTypes.object,
};

export default ContextMenu;
