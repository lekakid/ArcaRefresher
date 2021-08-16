import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Block } from '@material-ui/icons';

import { MODULE_ID as CONTEXT_MODULE_ID } from '../$ContextMenu/ModuleInfo';
import ContextMenuList from '../$ContextMenu/ContextMenuList';
import { closeContextMenu, setContextSnack } from '../$ContextMenu/slice';

import { CONTEXT_EMOTICON_MUTE } from './ModuleInfo';
import getEmoticonInfo from './getEmoticonInfo';
import { addEmoticon } from './slice';

export default function EmoticonContextMenu() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state[CONTEXT_MODULE_ID]);

  const handleMute = useCallback(() => {
    (async () => {
      const { id, url } = data[CONTEXT_EMOTICON_MUTE];
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
