import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Block } from '@material-ui/icons';

import { setClose, setContextSnack } from 'menu/ContextMenu/slice';

import { getBundleData, getBundleInfo } from '../func';
import { addEmoticon } from '../slice';

function Emoticon({ triggerList }) {
  const dispatch = useDispatch();
  const data = useRef(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const trigger = (target) => {
      if (!target.matches('.emoticon')) {
        data.current = null;
        setValid(false);
        return false;
      }

      data.current = {
        emotID: target.dataset.id,
        url: target.src.replace('https:', ''),
      };
      setValid(true);
      return true;
    };

    triggerList.current.push(trigger);
  }, [triggerList]);

  const handleBundleMute = useCallback(() => {
    (async () => {
      try {
        const { emotID, url } = data.current;
        const { id: bundleID, name: bundleName } = await getBundleInfo(emotID);
        const { idList, urlList } = await getBundleData(bundleID);

        if (idList.length === 0) {
          dispatch(
            addEmoticon({
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
            addEmoticon({
              id: bundleID,
              emoticon: { name: bundleName, bundle: idList, url: urlList },
            }),
          );
        }
      } catch (e) {
        setContextSnack({
          msg: `${e.message}\n개발자 도구(F12)의 콘솔(Console)창 캡쳐와 함께 문의바랍니다.`,
          time: 3000,
        });
        console.error(e);
      }

      dispatch(setClose());
    })();
  }, [dispatch]);

  const handleSingleMute = useCallback(() => {
    (async () => {
      try {
        const { emotID, url } = data.current;
        const { id: bundleID, name: bundleName } = await getBundleInfo(emotID);

        dispatch(
          addEmoticon({
            id: bundleID,
            emoticon: {
              name: bundleName,
              bundle: [parseInt(emotID, 10)],
              url: [url],
            },
          }),
        );
      } catch (e) {
        setContextSnack({
          msg: `${e.message}\n개발자 도구(F12)의 콘솔(Console)창 캡쳐와 함께 문의바랍니다.`,
          time: 3000,
        });
        console.error(e);
      }

      dispatch(setClose());
    })();
  }, [dispatch]);

  if (!valid) return null;
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
