import React from 'react';
import { useSelector } from 'react-redux';
import { Box, List, Paper, Typography, MenuItem } from '@material-ui/core';

import { BACKGROUND, CURRENT, FOREGROUND } from 'func/window';

import { SelectRow, SwitchRow } from 'component/config';
import {
  $setContextRange,
  $setOpenType,
  $toggleIndicateMyComment,
  $toggleIdVisible,
  $toggleCheckSpamAccount,
} from '../slice';
import Info from '../FeatureInfo';

const View = React.forwardRef((_props, ref) => {
  const {
    contextRange,
    openType,
    indicateMyComment,
    showId,
    checkSpamAccount,
  } = useSelector((state) => state[Info.ID].storage);

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SelectRow
            divider
            primary="우클릭 메뉴 호출 범위"
            value={contextRange}
            action={$setContextRange}
          >
            <MenuItem value="articleItem">게시글</MenuItem>
            <MenuItem value="nickname">닉네임</MenuItem>
          </SelectRow>
          <SelectRow
            divider
            primary="프로필 및 검색 창을 여는 방식"
            value={openType}
            action={$setOpenType}
          >
            <MenuItem value={CURRENT}>열려있는 창에서</MenuItem>
            <MenuItem value={FOREGROUND}>새 창으로</MenuItem>
            <MenuItem value={BACKGROUND}>백그라운드 창으로</MenuItem>
          </SelectRow>
          <SwitchRow
            divider
            primary="작성한 댓글 표시"
            secondary="로그인 상태에서만 동작합니다"
            value={indicateMyComment}
            action={$toggleIndicateMyComment}
          />
          <SwitchRow
            divider
            primary="반고닉 이용자 고유아이디 표시"
            secondary="로그인 상태에서 정상동작합니다"
            value={showId}
            action={$toggleIdVisible}
          />
          <SwitchRow
            primary="글, 댓글 갯수 체크"
            secondary="우클릭 메뉴에 글, 댓글 갯수를 추가합니다"
            value={checkSpamAccount}
            action={$toggleCheckSpamAccount}
          />
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
