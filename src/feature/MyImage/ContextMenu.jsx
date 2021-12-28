import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { BrokenImage, PhotoLibrary } from '@material-ui/icons';

import { ARTICLE_IMAGES } from 'core/selector';
import { setClose, setContextSnack } from 'menu/ContextMenu/slice';
import { useParser } from 'util/Parser';

import { MODULE_ID } from './ModuleInfo';
import { addImage, removeImage } from './slice';

const ContextMenu = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function ContextMenu({ triggerList }, ref) {
    const dispatch = useDispatch();
    const { channelID } = useParser();
    const { imgList } = useSelector((state) => state[MODULE_ID]);
    const [exist, setExist] = useState({ channel: false, share: false });
    const data = useRef(null);
    const [valid, setValid] = useState(false);

    useEffect(() => {
      const trigger = (target) => {
        if (!target.closest(ARTICLE_IMAGES)) {
          data.current = null;
          setValid(false);
          return false;
        }

        const url = target.src.split('?')[0];
        data.current = url;
        setValid(true);
        return true;
      };

      triggerList.current.push(trigger);
    }, [triggerList]);

    useEffect(() => {
      setExist({
        channel: imgList[channelID]?.includes(data.current) || false,
        // eslint-disable-next-line no-underscore-dangle
        share: imgList._shared_?.includes(data.current) || false,
      });
    }, [valid, channelID, imgList]);

    const handleChannelImage = useCallback(() => {
      const action = exist.channel ? removeImage : addImage;
      dispatch(action({ channel: channelID, url: data.current }));
      dispatch(setClose());
      dispatch(
        setContextSnack({
          msg: `채널 자짤로 ${exist.channel ? '제거' : '저장'}했습니다.`,
          time: 3000,
        }),
      );
    }, [exist, dispatch, channelID]);

    const handleShareImage = useCallback(() => {
      const action = exist.share ? removeImage : addImage;
      dispatch(action({ channel: '_shared_', url: data.current }));
      dispatch(setClose());
      dispatch(
        setContextSnack({
          msg: `공용 자짤로 ${exist.share ? '제거' : '저장'}했습니다.`,
          time: 3000,
        }),
      );
    }, [exist, dispatch]);

    if (!valid) return null;
    return (
      <List>
        <MenuItem ref={ref} onClick={handleChannelImage}>
          <ListItemIcon>
            {exist.channel ? <BrokenImage /> : <PhotoLibrary />}
          </ListItemIcon>
          <Typography>
            {exist.channel ? '채널 자짤에서 제거' : '채널 자짤로 저장'}
          </Typography>
        </MenuItem>
        <MenuItem ref={ref} onClick={handleShareImage}>
          <ListItemIcon>
            {exist.share ? <BrokenImage /> : <PhotoLibrary />}
          </ListItemIcon>
          <Typography>
            {exist.share ? '공용 자짤에서 제거' : '공용 자짤로 저장'}
          </Typography>
        </MenuItem>
      </List>
    );
  },
);

export default ContextMenu;
