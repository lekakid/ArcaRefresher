import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { List, MenuItem, Paper, Typography } from '@mui/material';

import { SelectRow } from 'component/config';
import Info from '../FeatureInfo';
import { $setAutoTime } from '../slice';

const View = React.forwardRef((_props, ref) => {
  const { autoSaveTime } = useSelector((state) => state[Info.ID].storage);

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SelectRow
            primary="자동 저장 시간 설정"
            value={autoSaveTime}
            action={$setAutoTime}
          >
            <MenuItem value={0}>사용 안 함</MenuItem>
            <MenuItem value={60}>1분</MenuItem>
            <MenuItem value={180}>3분</MenuItem>
            <MenuItem value={300}>5분</MenuItem>
            <MenuItem value={600}>10분</MenuItem>
          </SelectRow>
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
