import { forwardRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { List, Paper, Typography, useMediaQuery } from '@mui/material';

import { SwitchRow } from 'component/ConfigMenu';
import Info from '../FeatureInfo';
import {
  // 모양
  $toggleDarkModeWriteForm,
} from '../slice';

const View = forwardRef((_props, ref) => {
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const {
    // 모양
    fixDarkModeWriteForm,
  } = useSelector((state) => state[Info.id].storage);

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Typography variant="subtitle2">모양 설정</Typography>
      <Paper>
        <List disablePadding>
          {!mobile && (
            <SwitchRow
              divider
              primary="카테고리 모양 수정"
              secondary="카테고리 선택 메뉴가 제목 왼쪽에 붙습니다."
              value={fixDarkModeWriteForm}
              action={$toggleDarkModeWriteForm}
            />
          )}
          <SwitchRow
            divider
            primary="다크모드 글작성 배경색 강제 픽스"
            secondary="다크모드에서 글작성 배경색이 흰색으로 뜨는 문제를 수정합니다."
            value={fixDarkModeWriteForm}
            action={$toggleDarkModeWriteForm}
          />
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.id})`;
export default View;
