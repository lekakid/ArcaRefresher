import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Comment } from '@material-ui/icons';

import { ARTICLE_IMAGES } from 'core/selector';
import { ContextMenuList, useContextMenu } from 'menu/ContextMenu';
import { setClose, setContextSnack } from 'menu/ContextMenu/slice';

import { MODULE_ID } from './ModuleInfo';
import { addImage } from './slice';

const ContextMenu = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function ContextMenu(_props, ref) {
    const dispatch = useDispatch();
    const { channelID } = useSelector((state) => state[MODULE_ID]);

    const trigger = useCallback(
      ({ target }) => !!target.closest(ARTICLE_IMAGES),
      [],
    );
    const dataGetter = useCallback(({ target }) => {
      const url = target.src.split('?')[0];

      return { url };
    }, []);
    const data = useContextMenu({ trigger, dataGetter });

    const handleChannelImage = useCallback(() => {
      dispatch(addImage({ channel: channelID, url: data.url }));
      dispatch(setClose());
      dispatch(
        setContextSnack({ msg: '채널 자짤로 저장했습니다.', time: 3000 }),
      );
    }, [channelID, dispatch, data]);

    const handleShareImage = useCallback(() => {
      dispatch(addImage({ channel: '_shared_', url: data.url }));
      dispatch(setClose());
      dispatch(
        setContextSnack({ msg: '공용 자짤로 저장했습니다.', time: 3000 }),
      );
    }, [dispatch, data]);

    if (!data) return null;
    return (
      <ContextMenuList>
        <MenuItem ref={ref} onClick={handleChannelImage}>
          <ListItemIcon>
            <Comment />
          </ListItemIcon>
          <Typography>채널 자짤로 저장</Typography>
        </MenuItem>
        <MenuItem ref={ref} onClick={handleShareImage}>
          <ListItemIcon>
            <Comment />
          </ListItemIcon>
          <Typography>공용 자짤로 저장</Typography>
        </MenuItem>
      </ContextMenuList>
    );
  },
);

export default ContextMenu;
