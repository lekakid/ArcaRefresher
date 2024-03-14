import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Collapse, List, Paper, Typography } from '@mui/material';

import { SwitchRow } from 'component/ConfigMenu';
import Info from '../FeatureInfo';
import { $toggleBlockAll, $toggleBlockDeleted } from '../slice';

const View = React.forwardRef((_props, ref) => {
  const { blockAll, blockDeleted } = useSelector(
    (state) => state[Info.id].storage,
  );

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="모든 게시물의 이미지 차단"
            value={blockAll}
            action={$toggleBlockAll}
          />
          <Collapse in={!blockAll}>
            <SwitchRow
              primary="삭제된 게시물 이미지 차단"
              secondary="채널 관리자 전용"
              value={blockDeleted}
              action={$toggleBlockDeleted}
            />
          </Collapse>
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.id})`;
export default View;
