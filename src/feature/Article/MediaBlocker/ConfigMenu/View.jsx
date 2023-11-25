import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { List, Paper, Typography } from '@mui/material';

import { SwitchRow } from 'component/ConfigMenu';
import Info from '../FeatureInfo';
import { $toggleEnabled, $toggleDeletedOnly } from '../slice';

const View = React.forwardRef((_props, ref) => {
  const { enabled, deletedOnly } = useSelector(
    (state) => state[Info.ID].storage,
  );

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            divider
            primary="사용"
            value={enabled}
            action={$toggleEnabled}
          />
          <SwitchRow
            primary="삭제된 게시물에서만 사용"
            secondary="채널 관리자 전용 기능입니다."
            value={deletedOnly}
            action={$toggleDeletedOnly}
          />
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
