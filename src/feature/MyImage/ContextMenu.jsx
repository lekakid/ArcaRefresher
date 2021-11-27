import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { BrokenImage, PhotoLibrary } from '@material-ui/icons';

import { ARTICLE_IMAGES } from 'core/selector';
import { ContextMenuList, useContextMenu } from 'menu/ContextMenu';
import { setClose, setContextSnack } from 'menu/ContextMenu/slice';
import { useParser } from 'util/Parser';

import { MODULE_ID } from './ModuleInfo';
import { addImage, removeImage } from './slice';

const ContextMenu = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function ContextMenu(_props, ref) {
    const dispatch = useDispatch();
    const { channelID } = useParser();
    const { imgList } = useSelector((state) => state[MODULE_ID]);

    const trigger = useCallback(
      ({ target }) => !!target.closest(ARTICLE_IMAGES),
      [],
    );
    const dataGetter = useCallback(({ target }) => {
      const url = target.src.split('?')[0];

      return { url };
    }, []);
    const data = useContextMenu({ trigger, dataGetter });

    const handleAddChannelImage = useCallback(() => {
      dispatch(addImage({ channel: channelID, url: data.url }));
      dispatch(setClose());
      dispatch(
        setContextSnack({ msg: '채널 자짤로 저장했습니다.', time: 3000 }),
      );
    }, [channelID, dispatch, data]);

    const handleRemoveChannelImage = useCallback(() => {
      dispatch(removeImage({ channel: channelID, url: data.url }));
      dispatch(setClose());
      dispatch(
        setContextSnack({ msg: '채널 자짤에서 제거했습니다.', time: 3000 }),
      );
    }, [channelID, dispatch, data]);

    const handleAddShareImage = useCallback(() => {
      dispatch(addImage({ channel: '_shared_', url: data.url }));
      dispatch(setClose());
      dispatch(
        setContextSnack({ msg: '공용 자짤로 저장했습니다.', time: 3000 }),
      );
    }, [dispatch, data]);

    const handleRemoveShareImage = useCallback(() => {
      dispatch(removeImage({ channel: '_shared_', url: data.url }));
      dispatch(setClose());
      dispatch(
        setContextSnack({ msg: '공용 자짤에서 제거했습니다.', time: 3000 }),
      );
    }, [dispatch, data]);

    const existChannelImage = imgList[channelID]?.includes(data?.url);
    // eslint-disable-next-line no-underscore-dangle
    const existShareImage = imgList._shared_?.includes(data?.url);

    if (!data) return null;
    return (
      <ContextMenuList>
        <MenuItem
          ref={ref}
          onClick={
            existChannelImage ? handleRemoveChannelImage : handleAddChannelImage
          }
        >
          <ListItemIcon>
            {existChannelImage ? <BrokenImage /> : <PhotoLibrary />}
          </ListItemIcon>
          <Typography>
            {existChannelImage ? '채널 자짤에서 제거' : '채널 자짤로 저장'}
          </Typography>
        </MenuItem>
        <MenuItem
          ref={ref}
          onClick={
            existShareImage ? handleRemoveShareImage : handleAddShareImage
          }
        >
          <ListItemIcon>
            {existShareImage ? <BrokenImage /> : <PhotoLibrary />}
          </ListItemIcon>
          <Typography>
            {existShareImage ? '공용 자짤에서 제거' : '공용 자짤로 저장'}
          </Typography>
        </MenuItem>
      </ContextMenuList>
    );
  },
);

export default ContextMenu;
