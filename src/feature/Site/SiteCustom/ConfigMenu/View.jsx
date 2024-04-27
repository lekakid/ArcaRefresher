import { forwardRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import {
  Collapse,
  List,
  MenuItem,
  Paper,
  Typography,
  useMediaQuery,
} from '@mui/material';

import {
  SelectRow,
  SliderRow,
  SwitchRow,
  TextFieldRow,
} from 'component/ConfigMenu';
import Info from '../FeatureInfo';
import {
  // 모양
  $setNotifyPosition,
  $toggleTopNews,
  $toggleSearchBar,
  $setRecentVisit,
  $toggleSideMenu,
  $toggleSideContents,
  $toggleSideBests,
  $toggleSideNews,
  $toggleFontSizeEnabled,
  $setFontSize,
  // 동작
  $setSpoofTitle,
  $setSpoofFavicon,
  $setPresetFavicon,
} from '../slice';

function labelFormat(x) {
  return `${x}px`;
}

const View = forwardRef((_props, ref) => {
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const {
    // 모양
    notifyPosition,
    topNews,
    searchBar,
    recentVisit,
    sideContents,
    sideBests,
    sideNews,
    sideMenu,
    fontSizeEnabled,
    fontSize,
    // 동작
    spoofTitle,
    presetFavicon,
    spoofFavicon,
  } = useSelector((state) => state[Info.id].storage);

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Typography variant="subtitle2">모양 설정</Typography>
      <Paper>
        <List disablePadding>
          <SelectRow
            divider
            primary="알림 위치"
            value={notifyPosition}
            action={(payload) => {
              unsafeWindow.showNotiAlert(
                '[ArcaRefresher] 알림 위치가 변경되었습니다.',
              );
              return $setNotifyPosition(payload);
            }}
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
          <SwitchRow
            divider
            primary="검색창 표시"
            value={searchBar}
            action={$toggleSearchBar}
          />
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
            divider={fontSizeEnabled}
            primary="사이트 전체 폰트 크기 설정"
            secondary="⚠ 사이트의 표시 설정을 무시합니다."
            value={fontSizeEnabled}
            action={$toggleFontSizeEnabled}
          />
          <Collapse in={fontSizeEnabled}>
            <SliderRow
              divider
              primary="폰트 크기"
              sliderProps={{
                min: 8,
                max: 30,
                step: 1,
                valueLabelFormat: labelFormat,
                valueLabelDisplay: 'auto',
              }}
              value={fontSize}
              action={$setFontSize}
              opacityOnChange={0.6}
            />
          </Collapse>
        </List>
      </Paper>
      <Typography variant="subtitle2">동작 설정</Typography>
      <Paper>
        <List disablePadding>
          <TextFieldRow
            divider
            primary="사이트 표시 제목 변경"
            secondary="공란일 시 변경하지 않습니다."
            value={spoofTitle}
            action={$setSpoofTitle}
          />
          <SelectRow
            divider
            primary="사이트 파비콘 변경"
            secondary={
              <>
                사이트 대표 아이콘을 다른 사이트로 변경합니다.
                <br />
                사용 시 새 알림 기능이 비활성화됩니다.
              </>
            }
            value={presetFavicon}
            action={$setPresetFavicon}
          >
            <MenuItem value="">사용 안 함</MenuItem>
            <MenuItem value="google">구글</MenuItem>
            <MenuItem value="gmail">G Mail</MenuItem>
            <MenuItem value="naver">네이버</MenuItem>
            <MenuItem value="custom">커스텀</MenuItem>
          </SelectRow>
          <Collapse in={presetFavicon === 'custom'}>
            <TextFieldRow
              primary="커스텀 파비콘 URL"
              manualSave
              value={spoofFavicon}
              action={$setSpoofFavicon}
            />
          </Collapse>
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.id})`;
export default View;
