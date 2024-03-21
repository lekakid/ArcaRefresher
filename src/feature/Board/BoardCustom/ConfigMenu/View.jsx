import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { List, Paper, Typography } from '@mui/material';

import { SliderRow, SwitchRow } from 'component/ConfigMenu';

import Info from '../FeatureInfo';
import {
  // 모양
  $setUserInfoWith,
  $toggleRateCount,
  // 동작
  $toggleContextMenu,
  $toggleArticleNewWindow,
  $toggleEnhancedArticleManage,
} from '../slice';

const View = React.forwardRef((_props, ref) => {
  const {
    // 모양
    userinfoWidth,
    rateCount,
    // 동작
    contextMenuEnabled,
    openArticleNewWindow,
    enhancedArticleManage,
  } = useSelector((state) => state[Info.id].storage);

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Typography variant="subtitle2">모양 설정</Typography>
      <Paper>
        <List disablePadding>
          <SliderRow
            divider
            primary="게시판 이용자 너비"
            opacityOnChange={0.6}
            value={userinfoWidth}
            action={$setUserInfoWith}
          />
          <SwitchRow
            primary="추천 수 표시"
            value={rateCount}
            action={$toggleRateCount}
          />
        </List>
      </Paper>
      <Typography variant="subtitle2">동작 설정</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="게시물 새 창에서 열기"
            secondary="게시판 화면에서 게시물을 클릭하면 새 창에서 열리게 합니다."
            value={openArticleNewWindow}
            action={$toggleArticleNewWindow}
          />
          <SwitchRow
            primary="개선된 게시물 관리 사용"
            secondary="체크박스의 클릭 범위를 여유롭게 만들고 드래그로 한번에 선택할 수 있습니다."
            value={enhancedArticleManage}
            action={$toggleEnhancedArticleManage}
          />
        </List>
      </Paper>
      <Typography variant="subtitle2">우클릭 메뉴</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="우클릭 메뉴 사용"
            value={contextMenuEnabled}
            action={$toggleContextMenu}
          />
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.id})`;
export default View;
