import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Slider,
  Switch,
} from '@material-ui/core';
import { ColorPicker, createColor } from 'material-ui-color';
import { makeStyles } from '@material-ui/styles';

import ConfigGroup from '../$Config/ConfigGroup';
import {
  toggleRecentVisit,
  toggleSideMenu,
  toggleAvatar,
  setNotifyColor,
  setUserInfoWith,
  setResizeImage,
  setResizeVideo,
  toggleModifiedIndicator,
  togglgLongComment,
} from './slice';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxWidth: 'md',
  },
}));

export default function ConfigView() {
  const dispatch = useDispatch();
  const {
    recentVisit,
    sideMenu,
    avatar,
    notifyColor,
    userinfoWidth,
    resizeImage,
    resizeVideo,
    modifiedIndicator,
    unfoldLongComment,
  } = useSelector((state) => state.LayoutCustom);
  const [pickerColor, setPickerColor] = useState(createColor(notifyColor));

  const handleRecentVisit = useCallback(() => {
    dispatch(toggleRecentVisit());
  }, [dispatch]);

  const handleSideMenu = useCallback(() => {
    dispatch(toggleSideMenu());
  }, [dispatch]);

  const handleAvatar = useCallback(() => {
    dispatch(toggleAvatar());
  }, [dispatch]);

  const handleNotifyColor = useCallback(
    (color) => {
      if (!color.error) dispatch(setNotifyColor(color.css.backgroundColor));
      setPickerColor(color);
    },
    [dispatch],
  );

  const handleUserinfoWidth = useCallback(
    (e, value) => {
      dispatch(setUserInfoWith(value));
    },
    [dispatch],
  );

  const handleResizeImage = useCallback(
    (e, value) => {
      dispatch(setResizeImage(value));
    },
    [dispatch],
  );

  const handleResizeVideo = useCallback(
    (e, value) => {
      dispatch(setResizeVideo(value));
    },
    [dispatch],
  );

  const handleModifiedIndicator = useCallback(() => {
    dispatch(toggleModifiedIndicator());
  }, [dispatch]);

  const handleUnfoldLongComment = useCallback(() => {
    dispatch(togglgLongComment());
  }, [dispatch]);

  const classes = useStyles();
  return (
    <ConfigGroup name="레이아웃 커스텀">
      <List className={classes.root}>
        <ListItem>
          <ListItemText>최근 방문 채널</ListItemText>
          <ListItemSecondaryAction>
            <Switch checked={recentVisit} onChange={handleRecentVisit} />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText>사이드 메뉴</ListItemText>
          <ListItemSecondaryAction>
            <Switch checked={sideMenu} onChange={handleSideMenu} />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText>이용자 아바타</ListItemText>
          <ListItemSecondaryAction>
            <Switch checked={avatar} onChange={handleAvatar} />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText>알림 아이콘 색상</ListItemText>
          <ListItemSecondaryAction>
            <ColorPicker
              hideTextfield
              value={pickerColor}
              onChange={handleNotifyColor}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText>게시판 이용자 추가 넓이</ListItemText>
        </ListItem>
        <ListItem>
          <Slider value={userinfoWidth} onChange={handleUserinfoWidth} />
        </ListItem>
        <ListItem>
          <ListItemText>게시물 이미지 크기</ListItemText>
        </ListItem>
        <ListItem>
          <Slider value={resizeImage} onChange={handleResizeImage} />
        </ListItem>
        <ListItem>
          <ListItemText>게시물 동영상 크기</ListItemText>
        </ListItem>
        <ListItem>
          <Slider value={resizeVideo} onChange={handleResizeVideo} />
        </ListItem>
        <ListItem>
          <ListItemText>댓글 *수정됨 표기</ListItemText>
          <ListItemSecondaryAction>
            <Switch
              checked={modifiedIndicator}
              onChange={handleModifiedIndicator}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText>장문 댓글 바로보기</ListItemText>
          <ListItemSecondaryAction>
            <Switch
              checked={unfoldLongComment}
              onChange={handleUnfoldLongComment}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </ConfigGroup>
  );
}
