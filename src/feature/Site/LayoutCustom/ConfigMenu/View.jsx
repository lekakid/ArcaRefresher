import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Collapse,
  List,
  MenuItem,
  Paper,
  Typography,
  useMediaQuery,
} from '@material-ui/core';

import { SelectRow, SwitchRow, SliderRow } from 'component/config';
import Info from '../FeatureInfo';
import {
  $toggleEnable,
  $setNotifyPosition,
  $toggleTopNews,
  $setRecentVisit,
  $toggleSideNews,
  $toggleSideMenu,
  $toggleAvatar,
  $setUserInfoWith,
  $toggleUnvote,
  $toggleModifiedIndicator,
  $toggleLongComment,
  $toggleSideContents,
  $toggleHideVoiceComment,
  $toggleSideBests,
  $toggleDarkModeWriteForm,
  $toggleReverseComment,
  $setResizeImage,
  $setResizeVideo,
  $setResizeEmoticonPalette,
  $setFontSize,
} from '../slice';

function labelFormat(x) {
  return `${x}px`;
}

function emotLabelFormat(x) {
  return `${x}칸`;
}

const View = React.forwardRef((_props, ref) => {
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
            primary="알림 위치"
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
              primary="상단 뉴스 헤더 표시"
              value={topNews}
              action={$toggleTopNews}
            />
          )}
          <SelectRow
            divider
            primary="최근 방문 채널 위치"
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
          <SliderRow
            primary="게시판 이용자 너비"
            value={userinfoWidth}
            action={$setUserInfoWith}
            opacityOnChange={0.6}
          />
        </List>
      </Paper>
      <Typography variant="subtitle2">게시물</Typography>
      <Paper>
        <List disablePadding>
          <SliderRow
            divider
            primary="이미지 크기"
            value={resizeImage}
            action={$setResizeImage}
            opacityOnChange={0.6}
          />
          <SliderRow
            divider
            primary="동영상 크기"
            value={resizeVideo}
            action={$setResizeVideo}
            opacityOnChange={0.6}
          />
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
          <SliderRow
            primary="이모티콘 선택창 높이"
            min={2}
            max={5}
            step={1}
            marks
            valueLabelFormat={emotLabelFormat}
            valueLabelDisplay="auto"
            value={resizeEmoticonPalette}
            action={$setResizeEmoticonPalette}
          />
        </List>
      </Paper>
      <Typography variant="subtitle2">접근성</Typography>
      <Paper>
        <List disablePadding>
          <SliderRow
            divider
            primary="사이트 전체 폰트 크기"
            secondary="표시 설정에서 글자 크기 브라우저 기본 설정 필요"
            min={8}
            max={30}
            valueLabelFormat={labelFormat}
            valueLabelDisplay="auto"
            value={fontSize}
            action={$setFontSize}
            opacityOnChange={0.6}
          />
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