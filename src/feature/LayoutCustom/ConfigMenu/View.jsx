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

import { useOpacity } from 'menu/ConfigMenu';
import Info from '../FeatureInfo';
import {
  $toggleEnable,
  $setFontSize,
  $setNotifyPosition,
  $toggleTopNews,
  $setRecentVisit,
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
  $toggleDarkModeWriteForm,
  $toggleReverseComment,
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
    reverseComment,
    hideVoiceComment,
    unfoldLongComment,
    fixDarkModeWriteForm,
  } = useSelector((state) => state[Info.ID].storage);
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const setOpacity = useOpacity();
  const classes = useStyles();

  const SliderCommited = () => {
    setOpacity(1);
  };

  const handleEnable = useCallback(() => {
    dispatch($toggleEnable());
  }, [dispatch]);

  // ------ 사이트 ------
  const handleNotifyPosition = useCallback(
    (e) => {
      dispatch($setNotifyPosition(e.target.value));
      unsafeWindow.showNotiAlert('[ArcaRefresher] 알림 위치가 변경되었습니다.');
    },
    [dispatch],
  );

  const handleTopNews = useCallback(() => {
    dispatch($toggleTopNews());
  }, [dispatch]);

  const handleRecentVisit = useCallback(
    (e) => {
      dispatch($setRecentVisit(e.target.value));
    },
    [dispatch],
  );

  const handleSideMenu = useCallback(() => {
    dispatch($toggleSideMenu());
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

  const handleAvatar = useCallback(() => {
    dispatch($toggleAvatar());
  }, [dispatch]);

  const handleUserinfoWidth = useCallback(
    (e, value) => {
      setOpacity(0.6);
      dispatch($setUserInfoWith(value));
    },
    [dispatch, setOpacity],
  );

  // ------ 게시물 ------
  const handleResizeImage = useCallback(
    (e, value) => {
      setOpacity(0.6);
      dispatch($setResizeImage(value));
    },
    [dispatch, setOpacity],
  );

  const handleResizeVideo = useCallback(
    (e, value) => {
      setOpacity(0.6);
      dispatch($setResizeVideo(value));
    },
    [dispatch, setOpacity],
  );

  const handleUnvote = useCallback(() => {
    dispatch($toggleUnvote());
  }, [dispatch]);

  // ------ 댓글 ------
  const handleUnfoldLongComment = useCallback(() => {
    dispatch($toggleLongComment());
  }, [dispatch]);

  const handleModifiedIndicator = useCallback(() => {
    dispatch($toggleModifiedIndicator());
  }, [dispatch]);

  const handleReverseComment = useCallback(() => {
    dispatch($toggleReverseComment());
  }, [dispatch]);

  const handleHideVoiceComment = useCallback(() => {
    dispatch($toggleHideVoiceComment());
  }, [dispatch]);

  const handleEmoticonPalette = useCallback(
    (e, value) => {
      dispatch($setResizeEmoticonPalette(value));
    },
    [dispatch],
  );

  // ------ 접근성 ------
  const handleFontSize = useCallback(
    (_e, value) => {
      dispatch($setFontSize(value));
    },
    [dispatch],
  );

  const handleDarkModeWriteForm = useCallback(() => {
    dispatch($toggleDarkModeWriteForm());
  }, [dispatch]);

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List>
          <ListItem button onClick={handleEnable}>
            <ListItemText primary="사용" />
            <ListItemSecondaryAction>
              <Switch checked={enabled} onChange={handleEnable} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
      <Typography variant="subtitle2">사이트</Typography>
      <Paper>
        <List>
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
                <MenuItem value="lefttop">왼쪽 위</MenuItem>
                <MenuItem value="righttop">오른쪽 위</MenuItem>
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
            <ListItemText primary="최근 방문 채널 위치" />
            <ListItemSecondaryAction>
              <Select
                variant="outlined"
                value={recentVisit}
                onChange={handleRecentVisit}
              >
                <MenuItem value="beforeBtns">개념글 버튼 위</MenuItem>
                <MenuItem value="afterAd">광고 아래</MenuItem>
                <MenuItem value="none">숨김</MenuItem>
              </Select>
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
          <ListItem>
            <ListItemText>게시판 이용자 너비</ListItemText>
            <ListItemSecondaryAction>
              <Slider
                value={userinfoWidth}
                onChange={handleUserinfoWidth}
                onChangeCommitted={SliderCommited}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
      <Typography variant="subtitle2">게시물</Typography>
      <Paper>
        <List>
          <ListItem divider>
            <ListItemText>이미지 크기</ListItemText>
            <ListItemSecondaryAction>
              <Slider
                value={resizeImage}
                onChange={handleResizeImage}
                onChangeCommitted={SliderCommited}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider>
            <ListItemText>동영상 크기</ListItemText>
            <ListItemSecondaryAction>
              <Slider
                value={resizeVideo}
                onChange={handleResizeVideo}
                onChangeCommitted={SliderCommited}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button onClick={handleUnvote}>
            <ListItemText primary="비추천 버튼 숨김" />
            <ListItemSecondaryAction>
              <Switch checked={hideUnvote} onChange={handleUnvote} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
      <Typography variant="subtitle2">댓글</Typography>
      <Paper>
        <List>
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
          <ListItem divider button onClick={handleModifiedIndicator}>
            <ListItemText primary="댓글 *수정됨 표시" />
            <ListItemSecondaryAction>
              <Switch
                checked={modifiedIndicator}
                onChange={handleModifiedIndicator}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={handleReverseComment}>
            <ListItemText primary="댓글 입력창을 가장 위로 올리기" />
            <ListItemSecondaryAction>
              <Switch
                checked={reverseComment}
                onChange={handleReverseComment}
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
          <ListItem>
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
        </List>
      </Paper>
      <Typography variant="subtitle2">접근성</Typography>
      <Paper>
        <List>
          <ListItem divider>
            <ListItemText
              primary="사이트 전체 폰트 크기"
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
          <ListItem button onClick={handleDarkModeWriteForm}>
            <ListItemText
              primary="다크모드 글작성 배경색 강제 픽스"
              secondary="다크모드에서 글작성 배경색이 흰색으로 뜨는 문제를 수정합니다."
            />
            <ListItemSecondaryAction>
              <Switch
                checked={fixDarkModeWriteForm}
                onChange={handleDarkModeWriteForm}
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
