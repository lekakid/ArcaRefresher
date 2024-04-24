import { forwardRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { List, MenuItem, Paper, Typography } from '@mui/material';

import { SelectRow, SwitchRow } from 'component/ConfigMenu';

import { $setAutoTime, $toggleDeleteOnCommit, $toggleEnabled } from '../slice';
import Info from '../FeatureInfo';

const View = forwardRef((_props, ref) => {
  const { enabled, autoSaveTime, deleteOnCommit } = useSelector(
    (state) => state[Info.id].storage,
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
          <SelectRow
            divider
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
          <SwitchRow
            primary="작성 완료 시 연결된 임시 저장 삭제"
            value={deleteOnCommit}
            action={$toggleDeleteOnCommit}
          />
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.id})`;
export default View;
