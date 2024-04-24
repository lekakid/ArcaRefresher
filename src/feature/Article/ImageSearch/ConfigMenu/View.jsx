import { forwardRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { List, MenuItem, Paper, Typography } from '@mui/material';

import { BACKGROUND, FOREGROUND } from 'func/window';

import { SelectRow, SwitchRow } from 'component/ConfigMenu';
import Info from '../FeatureInfo';
import {
  // 동작
  $toggleContextMenu,
  $setOpenType,
  $setSearchGoogleMethod,
  $toggleSauceNaoBypass,
  $toggleSearchBySource,
  // 사이트
  $toggleShowGoogle,
  $toggleShowBing,
  $toggleShowYandex,
  $toggleShowSauceNao,
  $toggleShowIqdb,
  $toggleShowAscii2D,
} from '../slice';

const View = forwardRef((_props, ref) => {
  const {
    // 동작
    contextMenuEnabled,
    openType,
    searchBySource,
    searchGoogleMethod,
    saucenaoBypass,
    // 사이트
    showGoogle,
    showBing,
    showYandex,
    showSauceNao,
    showIqdb,
    showAscii2D,
  } = useSelector((state) => state[Info.id].storage);

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Typography variant="subtitle2">동작 설정</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="사용"
            secondary="이미지에서 우클릭 메뉴가 활성화됩니다."
            value={contextMenuEnabled}
            action={$toggleContextMenu}
          />
          <SelectRow
            divider
            primary="검색 결과 창을 여는 방식"
            value={openType}
            action={$setOpenType}
          >
            <MenuItem value={FOREGROUND}>새 창으로</MenuItem>
            <MenuItem value={BACKGROUND}>백그라운드 창으로</MenuItem>
          </SelectRow>
          <SwitchRow
            divider
            primary="원본 이미지로 검색"
            secondary="검색 속도가 하락하지만 좀 더 정확한 이미지를 찾을 수도 있습니다."
            value={searchBySource}
            action={$toggleSearchBySource}
          />
          <SelectRow
            divider
            primary="구글 이미지 검색 방식"
            value={searchGoogleMethod}
            action={$setSearchGoogleMethod}
          >
            <MenuItem value="lens">구글 렌즈</MenuItem>
            <MenuItem value="source">소스 검색</MenuItem>
          </SelectRow>
          <SwitchRow
            primary="SauceNao 바이패스 활성화"
            secondary="정상적으로 검색되지 않을 때만 사용 바랍니다."
            value={saucenaoBypass}
            action={$toggleSauceNaoBypass}
          />
        </List>
      </Paper>
      <Typography variant="subtitle2">사용할 검색 사이트</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="Google"
            value={showGoogle}
            action={$toggleShowGoogle}
          />
          <SwitchRow
            divider
            primary="Bing"
            value={showBing}
            action={$toggleShowBing}
          />
          <SwitchRow
            divider
            primary="Yandex"
            value={showYandex}
            action={$toggleShowYandex}
          />
          <SwitchRow
            divider
            primary="SauceNao"
            value={showSauceNao}
            action={$toggleShowSauceNao}
          />
          <SwitchRow
            divider
            primary="IQDB"
            value={showIqdb}
            action={$toggleShowIqdb}
          />
          <SwitchRow
            divider
            primary="Ascii2D"
            value={showAscii2D}
            action={$toggleShowAscii2D}
          />
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.id})`;
export default View;
