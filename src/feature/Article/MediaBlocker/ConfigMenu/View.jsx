import React from 'react';
import { useSelector } from 'react-redux';
import { Box, List, Paper, Typography } from '@material-ui/core';

import { SwitchRow } from 'component/config';
import Info from '../FeatureInfo';
import { $toggleEnabled, $toggleDeletedOnly } from '../slice';

const View = React.forwardRef((_props, ref) => {
  const { enabled, deletedOnly } = useSelector(
    (state) => state[Info.ID].storage,
  );

  return (
    <Box ref={ref}>
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
            primary="삭제된 게시물에서만 사용(채널 관리자 전용)"
            value={deletedOnly}
            action={$toggleDeletedOnly}
          />
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;