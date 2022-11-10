import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Block } from '@material-ui/icons';

import { useContextMenu, useContextSnack } from 'menu/ContextMenu';
import { getBundleData, getBundleInfo } from '../func';
import { $addEmoticon } from '../slice';

function Emoticon({ targetRef }) {
  const dispatch = useDispatch();

  const setSnack = useContextSnack();
  const [data, closeMenu] = useContextMenu({
    targetRef,
    selector: '.emoticon',
    dataExtractor: (target) => ({
      emotID: target.dataset.id,
      url: target.src.replace('https:', ''),
    }),
  });

  const handleBundleMute = useCallback(() => {
    (async () => {
      try {
        const { emotID, url } = data;
        const { id: bundleID, name: bundleName } = await getBundleInfo(emotID);
        const { idList, urlList } = await getBundleData(bundleID);

        if (idList.length === 0) {
          dispatch(
            $addEmoticon({
              id: bundleID,
              emoticon: {
                name: bundleName,
                bundle: [parseInt(emotID, 10)],
                url: [url],
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
        const { emotID, url } = data;
        const { id: bundleID, name: bundleName } = await getBundleInfo(emotID);

        dispatch(
          $addEmoticon({
            id: bundleID,
            emoticon: {
              name: bundleName,
              bundle: [parseInt(emotID, 10)],
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

  if (!data) return null;
  return (
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
  );
}

export default Emoticon;
