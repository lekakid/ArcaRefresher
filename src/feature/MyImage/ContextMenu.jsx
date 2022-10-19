import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { BrokenImage, PhotoLibrary } from '@material-ui/icons';

import { ARTICLE_GIFS, ARTICLE_IMAGES } from 'core/selector';
import { setClose, setContextSnack } from 'menu/ContextMenu/slice';
import { useParser } from 'util/Parser';

import Info from './FeatureInfo';
import { addImage, removeImage } from './slice';

function ContextMenu({ triggerList }) {
  const dispatch = useDispatch();
  const { channel } = useParser();
  const {
    storage: { imgList },
  } = useSelector((state) => state[Info.ID]);
  const [exist, setExist] = useState({ channel: false, share: false });
  const data = useRef(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const trigger = (target) => {
      if (!target.closest(`${ARTICLE_IMAGES}, ${ARTICLE_GIFS}`)) {
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
      channel: imgList[channel.ID]?.includes(data.current) || false,
      // eslint-disable-next-line no-underscore-dangle
      share: imgList._shared_?.includes(data.current) || false,
    });
  }, [valid, channel, imgList]);

  const handleChannelImage = useCallback(() => {
    const action = exist.channel ? removeImage : addImage;
    dispatch(action({ channel: channel.ID, url: data.current }));
    dispatch(setClose());
    dispatch(
      setContextSnack({
        msg: `채널 자짤로 ${exist.channel ? '제거' : '저장'}했습니다.`,
        time: 3000,
      }),
    );
  }, [exist, dispatch, channel]);

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
      <MenuItem onClick={handleChannelImage}>
        <ListItemIcon>
          {exist.channel ? <BrokenImage /> : <PhotoLibrary />}
        </ListItemIcon>
        <Typography>
          {exist.channel ? '채널 자짤에서 제거' : '채널 자짤로 저장'}
        </Typography>
      </MenuItem>
      <MenuItem onClick={handleShareImage}>
        <ListItemIcon>
          {exist.share ? <BrokenImage /> : <PhotoLibrary />}
        </ListItemIcon>
        <Typography>
          {exist.share ? '공용 자짤에서 제거' : '공용 자짤로 저장'}
        </Typography>
      </MenuItem>
    </List>
  );
}

export default ContextMenu;
