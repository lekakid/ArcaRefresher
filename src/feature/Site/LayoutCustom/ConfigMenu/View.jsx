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
  Slider,
  Typography,
  useMediaQuery,
} from '@material-ui/core';

import { useOpacity } from 'menu/ConfigMenu';
import { SelectRow, SwitchRow } from 'component/config';
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

  const SliderCommited = () => {
    setOpacity(1);
  };

  // ------ 사이트 ------
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

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow primary="사용" value={enabled} action={$toggleEnable} />
        </List>
      </Paper>
      <Typography variant="subtitle2">사이트</Typography>
      <Paper>
        <List disablePadding>
          <SelectRow
            divider
            primary="메뉴 호출 방식"
            value={notifyPosition}
            action={$setNotifyPosition}
          >
            <MenuItem value="left">왼쪽</MenuItem>
            <MenuItem value="right">오른쪽</MenuItem>
            <MenuItem value="lefttop">왼쪽 위</MenuItem>
            <MenuItem value="righttop">오른쪽 위</MenuItem>
          </SelectRow>
          {mobile && (
            <SwitchRow
              divider
              primary="사용상단 뉴스 헤더 표시"
              value={topNews}
              action={$toggleTopNews}
            />
          )}
          <SelectRow
            divider
            primary="메뉴 호출 방식"
            value={recentVisit}
            action={$setRecentVisit}
          >
            <MenuItem value="beforeAd">광고 위</MenuItem>
            <MenuItem value="afterAd">광고 아래</MenuItem>
            <MenuItem value="none">숨김</MenuItem>
          </SelectRow>
          {!mobile && (
            <>
              <SwitchRow
                divider
                primary="우측 사이드 메뉴 표시"
                value={sideMenu}
                action={$toggleSideMenu}
              />
              <Collapse in={sideMenu}>
                <List disablePadding>
                  <SwitchRow
                    divider
                    nested
                    primary="사이드 컨텐츠 패널 표시"
                    value={sideContents}
                    action={$toggleSideContents}
                  />
                  <SwitchRow
                    divider
                    nested
                    primary="개념글 패널 표시"
                    value={sideBests}
                    action={$toggleSideBests}
                  />
                  <SwitchRow
                    divider
                    nested
                    primary="뉴스 패널 표시"
                    value={sideNews}
                    action={$toggleSideNews}
                  />
                </List>
              </Collapse>
            </>
          )}
          <SwitchRow
            divider
            primary="이용자 아바타 표시"
            value={avatar}
            action={$toggleAvatar}
          />
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
        <List disablePadding>
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
          <SwitchRow
            primary="비추천 버튼 숨김"
            value={hideUnvote}
            action={$toggleUnvote}
          />
        </List>
      </Paper>
      <Typography variant="subtitle2">댓글</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="장문 댓글 바로보기"
            secondary="4줄 이상 작성된 댓글을 바로 펼쳐봅니다."
            value={unfoldLongComment}
            action={$toggleLongComment}
          />
          <SwitchRow
            divider
            primary="댓글 *수정됨 표시"
            value={modifiedIndicator}
            action={$toggleModifiedIndicator}
          />
          <SwitchRow
            divider
            primary="댓글 입력창을 가장 위로 올리기"
            value={reverseComment}
            action={$toggleReverseComment}
          />
          <SwitchRow
            divider
            primary="음성 댓글 버튼 숨기기"
            value={hideVoiceComment}
            action={$toggleHideVoiceComment}
          />
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
        <List disablePadding>
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
          <SwitchRow
            primary="다크모드 글작성 배경색 강제 픽스"
            secondary="다크모드에서 글작성 배경색이 흰색으로 뜨는 문제를 수정합니다."
            value={fixDarkModeWriteForm}
            action={$toggleDarkModeWriteForm}
          />
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
