import { memo } from 'react';
import { useSelector } from 'react-redux';
import { List, Paper, Typography } from '@mui/material';

import { SwitchRow } from 'feature/Menu/ConfigMenu/component';

import info from '../info';
import { $toggleEnabled } from '../slice';

function Template() {
  const { enabled } = useSelector((state) => state[info.id].storage);

  return (
    <>
      <Typography variant="subtitle1">{info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow primary="사용" value={enabled} action={$toggleEnabled} />
        </List>
      </Paper>
    </>
  );
}

export default memo(Template);
