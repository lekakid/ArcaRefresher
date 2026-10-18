import { useSelector } from 'react-redux';
import { List, Paper, Typography } from '@mui/material';

import { SwitchRow } from 'feature/Menu/ConfigMenu/component';

import info from '../info';
import { $toggleEnabled } from '../slice';

function ChannelManager() {
  const { enabled } = useSelector((state) => state[info.id].storage);

  return (
    <>
      <Typography variant="subtitle1">{info.name}</Typography>
      <Paper>
        <List disablePadding>
          <SwitchRow
            primary="사용"
            secondary="구독 채널 목록을 그룹화 할 수 있습니다."
            value={enabled}
            action={$toggleEnabled}
          />
        </List>
      </Paper>
    </>
  );
}

export default ChannelManager;
