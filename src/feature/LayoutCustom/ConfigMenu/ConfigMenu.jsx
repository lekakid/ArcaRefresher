import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Slider,
  Switch,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { ColorPicker, createColor } from 'material-ui-color';

import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';
import {
  toggleEnable,
  setFontSize,
  toggleTopNews,
  toggleRecentVisit,
  toggleSideHumor,
  toggleSideNews,
  toggleSideMenu,
  toggleAvatar,
  setNotifyColor,
  setUserInfoWith,
  setResizeImage,
  setResizeVideo,
  toggleUnvote,
  toggleModifiedIndicator,
  toggleLongComment,
  toggleHumorCheckbox,
} from '../slice';

function labelFormat(x) {
  return `${x}px`;
}

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const ConfigMenu = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function ConfigMenu(_props, ref) {
    const dispatch = useDispatch();
    const {
      enabled,
      fontSize,
      topNews,
      recentVisit,
      sideHumor,
      sideNews,
      sideMenu,
      avatar,
      notifyColor,
      userinfoWidth,
      resizeImage,
      resizeVideo,
      hideUnvote,
      modifiedIndicator,
      unfoldLongComment,
      hideHumorCheckbox,
    } = useSelector((state) => state[MODULE_ID]);
    const [pickerColor, setPickerColor] = useState(createColor(notifyColor));
    const mobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const classes = useStyles();

    const handleEnable = useCallback(() => {
      dispatch(toggleEnable());
    }, [dispatch]);

    const handleFontSize = useCallback(
      (_e, value) => {
        dispatch(setFontSize(value));
      },
      [dispatch],
    );

    const handleRecentVisit = useCallback(() => {
      dispatch(toggleRecentVisit());
    }, [dispatch]);

    const handleTopNews = useCallback(() => {
      dispatch(toggleTopNews());
    }, [dispatch]);

    const handleSideHumor = useCallback(() => {
      dispatch(toggleSideHumor());
    }, [dispatch]);

    const handleSideNews = useCallback(() => {
      dispatch(toggleSideNews());
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

    const handleUnvote = useCallback(() => {
      dispatch(toggleUnvote());
    }, [dispatch]);

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
      <Box ref={ref}>
        <Typography variant="subtitle1">{MODULE_NAME}</Typography>
        <Paper>
          <List>
            <ListItem divider button onClick={handleEnable}>
              <ListItemText primary="사용" />
              <ListItemSecondaryAction>
                <Switch checked={enabled} onChange={handleEnable} />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem divider>
              <ListItemText
                primary="사이트 전체 폰트 크기 설정"
                secondary="표시 설정에서 글자 크기 브라우저 기본 설정 필요"
              />
              <ListItemSecondaryAction>
                <Slider
                  min={8}
                  max={30}
                  valueLabelDisplay="auto"
                  valueLabelFormat={labelFormat}
                  defaultValue={fontSize}
                  onChangeCommitted={handleFontSize}
                />
              </ListItemSecondaryAction>
            </ListItem>
            {mobile && (
              <ListItem divider button onClick={handleTopNews}>
                <ListItemText primary="상단 뉴스 헤더 표시" />
                <ListItemSecondaryAction>
                  <Switch checked={topNews} onChange={handleTopNews} />
                </ListItemSecondaryAction>
              </ListItem>
            )}
            <ListItem divider button onClick={handleRecentVisit}>
              <ListItemText primary="최근 방문 채널 표시" />
              <ListItemSecondaryAction>
                <Switch checked={recentVisit} onChange={handleRecentVisit} />
              </ListItemSecondaryAction>
            </ListItem>
            {!mobile && (
              <>
                <ListItem divider button onClick={handleSideMenu}>
                  <ListItemText primary="우측 사이드 메뉴 표시" />
                  <ListItemSecondaryAction>
                    <Switch checked={sideMenu} onChange={handleSideMenu} />
                  </ListItemSecondaryAction>
                </ListItem>
                <Collapse in={sideMenu}>
                  <List disablePadding>
                    <ListItem
                      className={classes.nested}
                      button
                      onClick={handleSideHumor}
                    >
                      <ListItemText primary="유머채널 패널 표시" />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={sideHumor}
                          onChange={handleSideHumor}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem
                      className={classes.nested}
                      divider
                      button
                      onClick={handleSideNews}
                    >
                      <ListItemText primary="뉴스 패널 표시" />
                      <ListItemSecondaryAction>
                        <Switch checked={sideNews} onChange={handleSideNews} />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Collapse>
              </>
            )}
            <ListItem divider button onClick={handleAvatar}>
              <ListItemText primary="이용자 아바타 표시" />
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
            <ListItem divider button onClick={handleUnvote}>
              <ListItemText primary="비추천 버튼 숨김" />
              <ListItemSecondaryAction>
                <Switch checked={hideUnvote} onChange={handleUnvote} />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem divider button onClick={handleModifiedIndicator}>
              <ListItemText primary="댓글 *수정됨 표시" />
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
              <ListItemText primary="유머 채널 동시 등록 체크박스 숨기기" />
              <ListItemSecondaryAction>
                <Switch
                  checked={hideHumorCheckbox}
                  onChange={handleHideHumorCheckbox}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>
      </Box>
    );
  },
);

ConfigMenu.displayName = `ConfigMenu(${MODULE_ID})`;
export default ConfigMenu;
