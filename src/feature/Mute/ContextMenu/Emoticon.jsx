import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Block } from '@material-ui/icons';

import { ContextMenuList, useContextMenu } from 'menu/ContextMenu';
import { setClose } from 'menu/ContextMenu/slice';

import { getEmoticonInfo } from '../func';
import { addEmoticon } from '../slice';

const Emoticon = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function Emoticon(_props, ref) {
    const dispatch = useDispatch();

    const trigger = useCallback(
      ({ target }) => !!target.matches('.emoticon'),
      [],
    );
    const dataGetter = useCallback(({ target }) => {
      const { id } = target.dataset;
      const url = target.src.replace('https:', '');

      return { id, url };
    }, []);
    const data = useContextMenu({ trigger, dataGetter });

    const handleMute = useCallback(() => {
      if (!data) return;
      (async () => {
        const { id, url } = data;
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
    }, [data, dispatch]);

    if (!data) return null;
    return (
      <ContextMenuList>
        <MenuItem ref={ref} onClick={handleMute}>
          <ListItemIcon>
            <Block />
          </ListItemIcon>
          <Typography>아카콘 뮤트</Typography>
        </MenuItem>
      </ContextMenuList>
    );
  },
);

export default Emoticon;
