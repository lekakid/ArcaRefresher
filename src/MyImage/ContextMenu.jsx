import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Comment } from '@material-ui/icons';

import { MODULE_ID as CONTEXT_MODULE_ID } from '../$ContextMenu/ModuleInfo';
import ContextMenuList from '../$ContextMenu/ContextMenuList';
import { closeContextMenu, setContextSnack } from '../$ContextMenu/slice';

import { MODULE_ID } from './ModuleInfo';
import { addImage } from './slice';

export default function ContextMenu() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state[CONTEXT_MODULE_ID]);
  const { channelID } = useSelector((state) => state[MODULE_ID]);
  const { url } = data[MODULE_ID];

  const handleChannelImage = useCallback(() => {
    dispatch(addImage({ channel: channelID, url }));
    dispatch(closeContextMenu());
    dispatch(setContextSnack({ msg: '채널 자짤로 저장했습니다.', time: 3000 }));
  }, [channelID, dispatch, url]);

  const handleShareImage = useCallback(() => {
    dispatch(addImage({ channel: '_shared_', url }));
    dispatch(closeContextMenu());
    dispatch(setContextSnack({ msg: '공용 자짤로 저장했습니다.', time: 3000 }));
  }, [dispatch, url]);

  return (
    <ContextMenuList>
      <MenuItem onClick={handleChannelImage}>
        <ListItemIcon>
          <Comment />
        </ListItemIcon>
        <Typography>채널 자짤로 저장</Typography>
      </MenuItem>
      <MenuItem onClick={handleShareImage}>
        <ListItemIcon>
          <Comment />
        </ListItemIcon>
        <Typography>공용 자짤로 저장</Typography>
      </MenuItem>
    </ContextMenuList>
  );
}
