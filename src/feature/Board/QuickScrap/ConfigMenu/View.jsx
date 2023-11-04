import React from 'react';
import { useSelector } from 'react-redux';
import { Box, List, Paper, Typography } from '@material-ui/core';

import { SwitchRow } from 'component/config';

import Info from '../FeatureInfo';
import { $toggleEnabled } from '../slice';

const View = React.forwardRef((_props, ref) => {
  const { enabled } = useSelector((state) => state[Info.ID].storage);

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow primary="사용" value={enabled} action={$toggleEnabled} />
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
