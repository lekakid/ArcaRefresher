import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Block } from '@material-ui/icons';

import { setClose } from 'menu/ContextMenu/slice';

import { getEmoticonInfo } from '../func';
import { addEmoticon } from '../slice';

const Emoticon = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function Emoticon({ triggerList }, ref) {
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
          id: target.dataset.id,
          url: target.src.replace('https:', ''),
        };
        setValid(true);
        return true;
      };

      triggerList.current.push(trigger);
    }, [triggerList]);

    const handleMute = useCallback(() => {
      (async () => {
        const { id, url } = data.current;
        const {
          bundleID,
          name,
          bundle,
          url: urlList,
        } = await getEmoticonInfo(id);

        if (bundle.length === 0) {
          dispatch(
            addEmoticon({
              id: bundleID,
              emoticon: { name, bundle: [id], url: [url] },
            }),
          );
        } else {
          dispatch(
            addEmoticon({
              id: bundleID,
              emoticon: { name, bundle, url: urlList },
            }),
          );
        }

        dispatch(setClose());
      })();
    }, [dispatch]);

    if (!valid) return null;
    return (
      <List>
        <MenuItem ref={ref} onClick={handleMute}>
          <ListItemIcon>
            <Block />
          </ListItemIcon>
          <Typography>아카콘 뮤트</Typography>
        </MenuItem>
      </List>
    );
  },
);

export default Emoticon;
