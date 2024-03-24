import { forwardRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { List, Paper, Typography, MenuItem } from '@mui/material';

import { BACKGROUND, CURRENT, FOREGROUND } from 'func/window';
import { SelectRow, SwitchRow } from 'component/ConfigMenu';

import {
  $toggleIdVisible,
  $toggleAvatar,
  $toggleIndicateMyComment,
  $setContextRange,
  $setOpenType,
  $toggleCheckSpamAccount,
} from '../slice';
import Info from '../FeatureInfo';

const View = forwardRef((_props, ref) => {
  const {
    avatar,
    showId,
    indicateMyComment,
    contextRange,
    openType,
    checkSpamAccount,
  } = useSelector((state) => state[Info.id].storage);

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Typography variant="subtitle2">모양 설정</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="이용자 아바타 표시"
            value={avatar}
            action={$toggleAvatar}
          />
          <SwitchRow
            divider
            primary="반고닉 이용자 고유아이디 표시"
            secondary="로그인 상태에서 정상동작합니다"
            value={showId}
            action={$toggleIdVisible}
          />
          <SwitchRow
            primary="작성한 댓글 표시"
            secondary="로그인 상태에서만 동작합니다"
            value={indicateMyComment}
            action={$toggleIndicateMyComment}
          />
        </List>
      </Paper>
      <Typography variant="subtitle2">우클릭 메뉴</Typography>
      <Paper>
        <List disablePadding>
          <SelectRow
            divider
            primary="호출 범위"
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
            primary="글, 댓글 갯수 표시"
            value={checkSpamAccount}
            action={$toggleCheckSpamAccount}
          />
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.id})`;
export default View;
