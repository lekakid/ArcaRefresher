import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Block } from '@material-ui/icons';

import { ContextMenuList, useContextMenuData } from '~/$ContextMenu';
import { closeContextMenu, setContextSnack } from '~/$ContextMenu/slice';

import { getEmoticonInfo } from '../func';
import { addEmoticon } from '../slice';

import { EMOTICON_MUTE } from './id';

export default function Emoticon() {
  const dispatch = useDispatch();
  const data = useContextMenuData(EMOTICON_MUTE);

  const handleMute = useCallback(() => {
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

      dispatch(setContextSnack({ msg: '뮤트되었습니다.', time: 3000 }));
      dispatch(closeContextMenu());
    })();
  }, [data, dispatch]);

  return (
    <ContextMenuList>
      <MenuItem onClick={handleMute}>
        <ListItemIcon>
          <Block />
        </ListItemIcon>
        <Typography>아카콘 뮤트</Typography>
      </MenuItem>
    </ContextMenuList>
  );
}
