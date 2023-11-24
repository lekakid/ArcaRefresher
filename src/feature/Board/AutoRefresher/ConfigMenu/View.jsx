import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { List, MenuItem, Paper, Typography } from '@mui/material';

import { SelectRow, SwitchRow } from 'component/config';
import Info from '../FeatureInfo';
import {
  $toggleAnimation,
  $setTimeLimit,
  $setMaxTime,
  $toggleRefreshOnArticle,
} from '../slice';

const View = React.forwardRef((_props, ref) => {
  const { countdown, maxTime, refreshOnArticle, showProgress } = useSelector(
    (state) => state[Info.ID].storage,
  );

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SelectRow
            divider
            primary="갱신 시간 설정"
            value={countdown}
            action={$setTimeLimit}
          >
            <MenuItem value={0}>사용 안 함</MenuItem>
            <MenuItem value={5}>5초</MenuItem>
            <MenuItem value={10}>10초</MenuItem>
            <MenuItem value={20}>20초</MenuItem>
            <MenuItem value={30}>30초</MenuItem>
            <MenuItem value={60}>1분</MenuItem>
          </SelectRow>
          <SelectRow
            divider
            primary="최대 갱신 스킵 시간"
            secondary="이 시간만큼 게시물 갱신이 없으면 반드시 새로고침합니다."
            value={maxTime}
            action={$setMaxTime}
          >
            <MenuItem value={-1}>사용 안 함</MenuItem>
            <MenuItem value={60}>1분</MenuItem>
            <MenuItem value={120}>2분</MenuItem>
            <MenuItem value={300}>5분</MenuItem>
            <MenuItem value={600}>10분</MenuItem>
          </SelectRow>
          <SwitchRow
            divider
            primary="게시물 조회 중에도 갱신"
            secondary="단, 1페이지를 확실히 보장할 수 있을 때만 동작합니다."
            value={refreshOnArticle}
            action={$toggleRefreshOnArticle}
          />
          <SwitchRow
            primary="갱신 애니메이션 표시"
            value={showProgress}
            action={$toggleAnimation}
          />
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
