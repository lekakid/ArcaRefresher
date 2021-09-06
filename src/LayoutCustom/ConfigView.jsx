import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Slider,
  Switch,
  Typography,
} from '@material-ui/core';
import { ColorPicker, createColor } from 'material-ui-color';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import {
  toggleRecentVisit,
  toggleSideMenu,
  toggleAvatar,
  setNotifyColor,
  setUserInfoWith,
  setResizeImage,
  setResizeVideo,
  toggleModifiedIndicator,
  toggleLongComment,
  toggleHumorCheckbox,
} from './slice';

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
    hideHumorCheckbox,
  } = useSelector((state) => state[MODULE_ID]);
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
      if (color.name === 'none') {
        dispatch(setNotifyColor(''));
        setPickerColor(createColor(''));
        return;
      }
      dispatch(setNotifyColor(color.css.backgroundColor));
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
    dispatch(toggleLongComment());
  }, [dispatch]);

  const handleHideHumorCheckbox = useCallback(() => {
    dispatch(toggleHumorCheckbox());
  }, [dispatch]);

  return (
    <>
      <Typography variant="subtitle1">{MODULE_NAME}</Typography>
      <Paper>
        <List>
          <ListItem divider button onClick={handleRecentVisit}>
            <ListItemText primary="최근 방문 채널 보이기" />
            <ListItemSecondaryAction>
              <Switch checked={recentVisit} onChange={handleRecentVisit} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={handleSideMenu}>
            <ListItemText primary="우측 사이드 메뉴" />
            <ListItemSecondaryAction>
              <Switch checked={sideMenu} onChange={handleSideMenu} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={handleAvatar}>
            <ListItemText primary="이용자 아바타" />
            <ListItemSecondaryAction>
              <Switch checked={avatar} onChange={handleAvatar} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="알림 아이콘 색상"
              secondary="상단 메뉴의 알림 아이콘 점등색을 변경합니다."
            />
            <ListItemSecondaryAction>
              <ColorPicker
                hideTextfield
                deferred
                value={pickerColor}
                onChange={handleNotifyColor}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider>
            <ListItemText>게시판 이용자 너비</ListItemText>
            <ListItemSecondaryAction>
              <Slider value={userinfoWidth} onChange={handleUserinfoWidth} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider>
            <ListItemText>게시물 이미지 크기</ListItemText>
            <ListItemSecondaryAction>
              <Slider value={resizeImage} onChange={handleResizeImage} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider>
            <ListItemText>게시물 동영상 크기</ListItemText>
            <ListItemSecondaryAction>
              <Slider value={resizeVideo} onChange={handleResizeVideo} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={handleModifiedIndicator}>
            <ListItemText primary="댓글 *수정됨 표기" />
            <ListItemSecondaryAction>
              <Switch
                checked={modifiedIndicator}
                onChange={handleModifiedIndicator}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={handleUnfoldLongComment}>
            <ListItemText
              primary="장문 댓글 바로보기"
              secondary="4줄 이상 작성된 댓글을 바로 펼쳐봅니다."
            />
            <ListItemSecondaryAction>
              <Switch
                checked={unfoldLongComment}
                onChange={handleUnfoldLongComment}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button onClick={handleHideHumorCheckbox}>
            <ListItemText primary="유머 채널 동시 등록 체크박스 숨김" />
            <ListItemSecondaryAction>
              <Switch
                checked={hideHumorCheckbox}
                onChange={handleHideHumorCheckbox}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </>
  );
}
