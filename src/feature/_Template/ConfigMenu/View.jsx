import { useSelector } from 'react-redux';
import { List, Paper, Typography } from '@mui/material';

import { SwitchRow } from 'feature/Menu/ConfigMenu/component';

import info from '../info';
import { $toggleEnabled } from '../slice';

function View() {
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

View.displayName = `ConfigMenuView(${info.id})`;
export default View;
