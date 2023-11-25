import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { List, Paper, Typography } from '@mui/material';

import { SwitchRow } from 'component/ConfigMenu';

import Info from '../FeatureInfo';
import { $toggleContextMenu } from '../slice';

const View = React.forwardRef((_props, ref) => {
  const { contextMenuEnabled } = useSelector((state) => state[Info.ID].storage);

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            primary="우클릭 메뉴 사용"
            value={contextMenuEnabled}
            action={$toggleContextMenu}
          />
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
