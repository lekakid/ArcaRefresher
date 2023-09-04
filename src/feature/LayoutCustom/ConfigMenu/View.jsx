import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Slider,
  Switch,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import Info from '../FeatureInfo';
import {
  $toggleEnable,
  $setFontSize,
  $setNotifyPosition,
  $toggleTopNews,
  $toggleRecentVisit,
  $toggleSideNews,
  $toggleSideMenu,
  $toggleAvatar,
  $setUserInfoWith,
  $setResizeImage,
  $setResizeVideo,
  $setResizeEmoticonPalette,
  $toggleUnvote,
  $toggleModifiedIndicator,
  $toggleLongComment,
  $toggleSideContents,
  $toggleHideVoiceComment,
  $toggleSideBests,
} from '../slice';

function labelFormat(x) {
  return `${x}px`;
}

function emotLabelFormat(x) {
  return `${x}칸`;
}

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const View = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const {
    enabled,
    fontSize,
    notifyPosition,
    topNews,
    recentVisit,
    sideContents,
    sideBests,
    sideNews,
    sideMenu,
    avatar,
    userinfoWidth,
    resizeImage,
    resizeVideo,
    resizeEmoticonPalette,
    hideUnvote,
    modifiedIndicator,
    hideVoiceComment,
    unfoldLongComment,
  } = useSelector((state) => state[Info.ID].storage);
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const classes = useStyles();

  const handleEnable = useCallback(() => {
    dispatch($toggleEnable());
  }, [dispatch]);

  const handleFontSize = useCallback(
    (_e, value) => {
      dispatch($setFontSize(value));
    },
    [dispatch],
  );

  const handleNotifyPosition = useCallback(
    (e) => {
      dispatch($setNotifyPosition(e.target.value));
    },
    [dispatch],
  );

  const handleRecentVisit = useCallback(() => {
    dispatch($toggleRecentVisit());
  }, [dispatch]);

  const handleTopNews = useCallback(() => {
    dispatch($toggleTopNews());
  }, [dispatch]);

  const handleSideContents = useCallback(() => {
    dispatch($toggleSideContents());
  }, [dispatch]);

  const handleSideBests = useCallback(() => {
    dispatch($toggleSideBests());
  }, [dispatch]);

  const handleSideNews = useCallback(() => {
    dispatch($toggleSideNews());
  }, [dispatch]);

  const handleSideMenu = useCallback(() => {
    dispatch($toggleSideMenu());
  }, [dispatch]);

  const handleAvatar = useCallback(() => {
    dispatch($toggleAvatar());
  }, [dispatch]);

  const handleUserinfoWidth = useCallback(
    (e, value) => {
      dispatch($setUserInfoWith(value));
    },
    [dispatch],
  );

  const handleResizeImage = useCallback(
    (e, value) => {
      dispatch($setResizeImage(value));
    },
    [dispatch],
  );

  const handleResizeVideo = useCallback(
    (e, value) => {
      dispatch($setResizeVideo(value));
    },
    [dispatch],
  );

  const handleEmoticonPalette = useCallback(
    (e, value) => {
      dispatch($setResizeEmoticonPalette(value));
    },
    [dispatch],
  );

  const handleUnvote = useCallback(() => {
    dispatch($toggleUnvote());
  }, [dispatch]);

  const handleModifiedIndicator = useCallback(() => {
    dispatch($toggleModifiedIndicator());
  }, [dispatch]);

  const handleHideVoiceComment = useCallback(() => {
    dispatch($toggleHideVoiceComment());
  }, [dispatch]);

  const handleUnfoldLongComment = useCallback(() => {
    dispatch($toggleLongComment());
  }, [dispatch]);

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
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
          <ListItem divider>
            <ListItemText primary="알림창 위치 설정" />
            <ListItemSecondaryAction>
              <Select
                variant="outlined"
                value={notifyPosition}
                onChange={handleNotifyPosition}
              >
                <MenuItem value="left">왼쪽</MenuItem>
                <MenuItem value="right">오른쪽</MenuItem>
              </Select>
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
                    divider
                    button
                    onClick={handleSideContents}
                  >
                    <ListItemText primary="사이드 컨텐츠 패널 표시" />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={sideContents}
                        onChange={handleSideContents}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem
                    className={classes.nested}
                    divider
                    button
                    onClick={handleSideBests}
                  >
                    <ListItemText primary="개념글 패널 표시" />
                    <ListItemSecondaryAction>
                      <Switch checked={sideBests} onChange={handleSideBests} />
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
          <ListItem divider>
            <ListItemText>이모티콘 선택창 높이</ListItemText>
            <ListItemSecondaryAction>
              <Slider
                value={resizeEmoticonPalette}
                min={2}
                max={5}
                step={1}
                marks
                valueLabelFormat={emotLabelFormat}
                valueLabelDisplay="auto"
                onChange={handleEmoticonPalette}
              />
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
          <ListItem divider button onClick={handleHideVoiceComment}>
            <ListItemText primary="음성 댓글 버튼 숨기기" />
            <ListItemSecondaryAction>
              <Switch
                checked={hideVoiceComment}
                onChange={handleHideVoiceComment}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button onClick={handleUnfoldLongComment}>
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
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
