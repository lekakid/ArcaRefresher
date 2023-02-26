import React, { useCallback, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Typography,
  Box,
  Dialog,
  DialogContent,
} from '@material-ui/core';
import { GitHub, Help, OpenInNew } from '@material-ui/icons';
import QRCode from 'react-qr-code';

import Info from '../FeatureInfo';

const DONATION_URL = 'https://toss.me/lekakid';

const View = React.forwardRef((_props, ref) => {
  const [open, setOpen] = useState(false);

  const handleVisitChannel = useCallback(() => {
    window.open('https://arca.live/b/namurefresher');
  }, []);

  const handleVisitGithub = useCallback(() => {
    window.open('https://github.com/lekakid/ArcaRefresher');
  }, []);

  const handleVisitToss = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List>
          <ListItem divider>
            <ListItemText primary="버전" />
            <ListItemSecondaryAction>
              <Typography>{GM_info.script.version}</Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={handleVisitChannel}>
            <ListItemText primary="아카리프레셔 채널 (문의 접수)" />
            <ListItemSecondaryAction>
              <Help />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={handleVisitGithub}>
            <ListItemText primary="Github" />
            <ListItemSecondaryAction>
              <GitHub />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button onClick={handleVisitToss}>
            <ListItemText primary="토스로 후원하기" />
            <ListItemSecondaryAction>
              <OpenInNew />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <Typography style={{ textAlign: 'center' }}>
            아래의 QR코드로 방문해주세요
          </Typography>
          <Box padding={2}>
            <QRCode value={DONATION_URL} />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
